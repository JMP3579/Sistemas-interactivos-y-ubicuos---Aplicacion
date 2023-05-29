

// Slider para perfiles de usuarios
const socket = io();
var TrandingSlider = new Swiper('.slider', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2.5,
  }

});

export { TrandingSlider, socket };
