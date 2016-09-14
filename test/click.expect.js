/*! Generated with PostCSS Click */

$(function() {

  $(".foo").on("click", function() {
    $(this).next().css({
      "color": "red"
    }).toggleClass("new").modal();
  });

  $(".bar .woo").on("click", function() {
    $(".opa a").css({
      "color": "green",
      "background-color": "yellow"
    });
  });

});
