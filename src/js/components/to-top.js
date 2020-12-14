const top = $('.to-top');

$(window).scroll(function () {
  if ($(this).scrollTop() >= 2000) {
    top.fadeIn();
  } else {
    top.fadeOut();
  }
});

top.on('click', function () {
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    500
  );
});
