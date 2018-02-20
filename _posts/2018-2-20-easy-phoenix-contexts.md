---
layout: post
published: true
title: Easy Phoenix Contexts
date: 2018-2-20
categories: Phoenix Elixir
---

The new version of [Phoenix](phoenix) introduces a concept
called `contexts`. Contexts are use to separate your app
into specific domains as well as house the business logic
for your CRUDy interactions. I am a big fan of contexts,
but the way that they are presented in the templates include
a good amount of duplicated-ish code. For example, if i had
an `Accounts` context that controlled a `User` schema and
a `Profile` schema, i would need to create functions
`get_user` and `get_profile` which both take in an id
and return a User.

I was finding myself rewriting a lot of the same code
every time i added a new schema to a context, so I made
this little module that can be used with any phoenix app
to make contexts a little more concise.


```elixir
defmodule MyAppWeb.Context do
  @moduledoc """
  The context module provides a few methods used throughout
  all of the contexts through its using macro. You can then
  override methods for certain schemas like so.

    defmodule MyApp.Users do
      use MyAppWeb.Context
      alias MyApp.Users.User

      get(User, id), do: User |> super() |> Repo.preload([:url])

      # call `context_fallbacks\0` to call defaults for overriden fns
      context_fallbacks()
    end
  """

  defmacro __using__(_opts) do
    quote do
      import Ecto.{Query, Changeset}, warn: false
      import MyAppWeb.Context
      alias MyApp.Repo

      @spec list(Ecto.Queryable.t()) :: [Ecto.Schema.t()]
      def list(schema), do: Repo.all(schema)

      @spec get(Ecto.Queryable.t(), integer | binary) :: Ecto.Schema.t() | nil
      def get(schema, id), do: Repo.get(schema, id)

      @spec get_by(Ecto.Queryable.t(), keyword | map) :: Ecto.Schema.t() | nil
      def get_by(schema, clauses), do: Repo.get_by(schema, clauses)

      @spec create(Ecto.Queryable.t(), map) :: {:ok, Ecto.Schema.t()} | {:error, Changeset.t()}
      def create(schema, attrs \\ %{}) do
        schema
        |> struct
        |> schema.changeset(attrs)
        |> Repo.insert()
      end

      @spec update(Ecto.Queryable.t(), Ecto.Schema.t(), map) ::
              {:ok, Ecto.Schema.t()} | {:error, Ecto.Changeset.t()}
      def update(schema, %schema{} = entity, attrs) do
        entity
        |> schema.changeset(attrs)
        |> Repo.update()
      end

      @spec delete(Ecto.Schema.t()) :: {:ok, Ecto.Schema.t()} | {:error, Ecto.Changeset.t()}
      def delete(entity), do: Repo.delete(entity)

      defoverridable list: 1, get: 2, get_by: 2, create: 2, update: 3, delete: 1
    end
  end

  @doc """
  Call this macro at the end of your context file
  to automatically call any of the main CRUD functions
  that you have overridden with the defaults
  """
  defmacro context_fallbacks() do
    quote do
      def list(other), do: super(other)
      def get(other, id), do: super(other, id)
      def get_by(other, clauses), do: super(other, clauses)
      def create(other, params), do: super(other, params)
      def update(other, schema, params), do: super(other, schema, params)
      def delete(other), do: super(other)
    end
  end
end
```

The module has comments to explain how to use it, but basically
you just use `using MyAppWeb.Context` at the top of your context
module. Then you get all the basic CRUD operations for your ecto
schemas (this is assuming you are using ecto). Then, for the example
Accounts module, you would just do `Accounts.get(User, 1)` and
`Accounts.get(Profile, 1)` to get a user or account, respectively.

If you need to add any methods, go for it, for example
`Accounts.get_current_user`. If you need to override any
of the basic functions for a schema (to provide preloads
or any extra functionality when creating or updating a schema
for example), just make sure that you call `context_fallbacks`
at the end of your module file, so that any of your overrides
won't destroy the functionality of other schema methods.

[phoenix]:http://phoenixframework.org/
