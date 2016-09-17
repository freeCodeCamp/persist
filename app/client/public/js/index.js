// function is_touch_device() {
//     return 'ontouchstart' in window // works on most browsers 
//         || navigator.maxTouchPoints; // works on IE10/11 and Surface
// };

// if (!is_touch_device()) {
//     $('div.info').hide();
//     $('div.project').on({
//         mouseenter: function() {
//             var $this = $(this);
//             $this.find('.info').slideDown('fast');
//         },
//         mouseleave: function() {
//             var $this = $(this);
//             $this.find('.info').slideUp('fast');
//         }
//     });
// }

$('#switch').on('click', function(event) {
    event.preventDefault();
    
    var logoLarger = $('#logo #large');
    var logoSmaller = $('#logo #small');

    $('#logo #large').toggle();
    $('#logo #small').toggle();

    $('#main_sidebar, #logo').toggleClass('large_nav small_nav', 200, 'linear');
    $('span.desc').toggle(200, 'linear');

});
