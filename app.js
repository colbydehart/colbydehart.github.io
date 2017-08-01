/* globals $ */
$(function() {
  $(".slide h3, .slide h1").click(slide);
  $(".slide .close").click(close);
  $("h3, h4, h1").each(function() {
    $(this).css({ color: randHex() });
  });
  $("a").each(function() {
    $(this).css({ color: randHex() });
  });
});

function close() {
  $(this).parent().slideToggle();
}

function slide(e) {
  $(this).next(".content").slideToggle();
}

function randHex() {
  var hexes = "9ABCDEF".split("");
  var res = "#";
  for (var i = 0; i < 6; i++) {
    res += hexes[Math.floor(Math.random() * hexes.length)];
  }
  return res;
}
