/*! Generated with PostCSS Click! */

$(function() {

  $("#change").on("click", function() {
    $("#target").css({
      "background-color": "indigo"
    }).addClass("active");
  });

  $("#reset").on("click", function() {
    $("#target").css({
      "background-color": "transparent"
    }).removeClass("active");
  });

  $(".foo").on("click", function() {
    $(this).next().css({
      "background-color": "SkyBlue"
    });
  });

  $(".bar").on("click", function() {
    $(this).prev().css({
      "background-color": "LightGreen"
    });
  });

  $("#reset-bg-color").on("click", function() {
    $(".foo").css({
      "background-color": "#f3f3f3"
    });
  });

  $("#reset-bg-color").on("click", function() {
    $(".bar").css({
      "background-color": "#f3f3f3"
    });
  });

  $("#toggle-collapse").on("click", function() {
    $("#collapse-example").collapse("toggle");
  });

  $(".change").on("click", function() {
    $(".target").css({
      "background": "indigo",
      "color": "#fff"
    });
  });

});
