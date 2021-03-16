---
layout: post
published: true
title: Type Safe Phoenix Controllers with Dialyzer
date: 2017-7-31
categories: Phoenix Elixir Dialyzer
---

[Phoenix][phoenix] 1.3 was just released. We have been using the rc version
for a while at my work and loving it. The addition of contexts has really
cleaned up the way we think about structuring code. Another addition is the
notion of a [Fallback Controller][fallback]. Just in case you haven't tried
out Phoenix 1.3 yet, the fallback controller allows you to only code the
happy path in your controllers, and anything that is not a `Plug.Conn`
struct fallback to a different controller to be handled. Using this along
with dialyzer, we have been able to add a bit of type safety to our application.

Say, we have a Phoenix controller that gets a user by id

```elixir
# lib/my_app_web/controllers/user_controlller.ex

defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller

  # new in Phoenix 1.3, this is our context for our Accounts entities
  alias MyApp.Accounts

  action_fallback MyAppWeb.FallbackController

  # notice this unhelpful spec, we'll fix this soon
  @spec index(Plug.Conn.t, map) :: any
  def get(conn, %{"id" => id}) do
    with user when not is_nil(user) <- Accounts.get_user(id) do
      render(conn, "show.json", user: user)
    end
  end
end
```

This is a pretty standard controller in Phoenix 1.3. The two noticeable
changes from 1.2 are the alias of a context, which is basically just a
module which handles your business logic for different domains, and the
`action_fallback` macro, which sets the fallback controller for this
controller. The fallback controller would look something like this.

```elixir
# lib/my_app_web/controllers/fallback_controlller.ex

defmodule MyAppWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use MyAppWeb, :controller

  def call(conn, nil) do
    conn
    |> put_status(:not_found)
    |> render(MyAppWeb.ErrorView, :"404")
  end
end
```

so here, we know that `Accounts.get_user/1` will return us a `User`
Ecto Schema, or `nil`. Knowing that if we don't find the user, the
nil will pass through to the fallback controller and hit the `call/2`
function with `nil` as the second argument, rendering an ErrorView.
This is the basic idea of the fallback controller.

So now, we want to add some type safety to this application so that
we can make sure that we handle all of the unhappy paths in our fallback
controller. Now we are going to edit the `lib/my_app_web.ex` file and
add a `controller_error` type to the controller using macro, so that the
type is accessible in all of our controllers.

```elixir
# lib/my_app_web.ex

defmodule MyAppWeb do
  # ...
  def controller do
    quote do
      use Phoenix.Controller, namespace: MyAppWeb
      import Plug.Conn
      import MyAppWeb.Router.Helpers
      import MyAppWeb.Gettext

      @type controller_error :: nil
    end
  end
```

You will need [Dialyxir][dialyxir] to be able to check your specs
and describing the installation and configuration of this tool is
outside of the scope of this post, but the docs are good and it is
not too difficult. Now with this type, we will add accurate specs
to our user and fallback controllers.

```elixir
# lib/my_app_web/controllers/user_controlller.ex

  @spec index(Plug.Conn.t, map) :: Plug.Conn.t | controller_error
  def get(conn, %{"id" => id}) do
```

```elixir
# lib/my_app_web/controllers/fallback_controlller.ex

  @spec call(Plug.Conn.t, controller_error) :: Plug.Conn.t
  def call(conn, nil) do
```

See, now we make sure that our controller actions will return either
a plug, or a `controller_error` and that our `call/2` function in
our fallback controller is able to handle any controller error we
have.

Say we add a new action to the user controller to create a user

```elixir
# lib/my_app_web/controllers/user_controlller.ex

  @spec create(Plug.Conn.t, map) :: Plug.Conn.t | controller_error
  def create(conn, %{"user" => user_params}) do
    with {:ok, user} <- Accounts.create_user(user_params) do
      conn
      |> put_status(:created)
      |> render("show.json", user: user)
    end
  end
end
```

We know that `Accounts.create_user/1` will always return either `{:ok, user}`
with the User Schema, or `{:error, changeset}`, where changeset is an Ecto
Changeset. If we run Dialyxir, we will get an error in the controller, because
it will see it is possible to return a value that is not either a `Plug.Conn.t`
or nil. All we need to do to fix this is update our `controller_error` type,
as well as handle this type of error in our fallback controller.

```elixir
# lib/my_app_web.ex

  # ...
      @type controller_error ::
        nil
        | {:error, Ecto.Changeset.t}
```

```elixir
# lib/my_app_web/controllers/fallback_controlller.ex

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> render(MyAppWeb.ChangesetView, "error.json", changeset: changeset)
  end
```

Nice, now we should get no errors from dialyzer. Basically just keep adding
error types to `controller_error` and handlers in your fallback controller
as you go and you can feel confident only coding the happiest paths in
your controllers.

[phoenix]:http://phoenixframework.org/
[fallback]:https://hexdocs.pm/phoenix/Phoenix.Controller.html#action_fallback/1
[dialyxir]:https://github.com/jeremyjh/dialyxir
