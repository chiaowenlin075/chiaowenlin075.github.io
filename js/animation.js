(function(){
  $(document).ready(function(){
    var scrollSkills = function() {
      $('.skill-pic').each(function(idx, el) {
        var delayTime = (idx + 1) > 10 ? 10 : (idx + 1)
        var className = "animated bounceIn animation-delay-" + delayTime.toString();
        $(el).addClass(className);
      })
    };

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('li.page-scroll').bind('click', function(event) {
        var $anchor = $(this.children[0]);
        var target = $(this.children[0].hash)[0];
        if (this.children[0].hash === "#skills") {
          scrollSkills();
        }

        $('html, body').stop().animate({
            scrollTop: $(target).offset().top - 70
        }, 1000);

        var dropdownBtn = $("#button")[0];
        if (dropdownBtn.checked) {
          dropdownBtn.checked = false
          $("#navbar").height(38);
          $($("#navbar > ul")[0]).height(38);
        }
        event.preventDefault();
    });

    $(window).on("scroll", function(e) {
      var dropdownBtn = $("#button")[0];
      if (dropdownBtn.checked) { return }
      $("#navbar").height(38);
    });

    $("#button").on("click", function(e) {
      var isNavbarClose = $("#navbar").height() === 38;
      var navbarHeight = isNavbarClose ? 196 : 38;
      var navlistHeight = isNavbarClose ? 158 : 38;
      $("#navbar").height(navbarHeight);
      $($("#navbar > ul")[0]).height(navlistHeight);
    });

  });
})();
