'use strict';

(function(){
  var slider = document.querySelector('.slider');
  var slidesCount;
  var currentSlide = 0;
  var slidesContainer;
  var dots;
  var intervalID;
  var timerID;

  var showPrevSlide = function() {
    currentSlide--;
    if (currentSlide < 0) currentSlide = slidesCount - 1;
    showSlide(currentSlide);
  }

  var showNextSlide = function() {
    currentSlide++;
    if (currentSlide > slidesCount - 1) currentSlide = 0;
    showSlide(currentSlide);
  }

  var showSlide = function(slideNumber) {
    var transform = 'translateX(-'+ slideNumber +'00%)';
    if (slideNumber === 0) transform = 'translateX(0%)';
    slidesContainer.style.transform = transform;

    for(var i = 0; i < dots.length; i++) {
      dots[i].classList.remove('slider__dot--active');
      if (i === slideNumber) dots[i].classList.add('slider__dot--active');
    }
  }

  var changeSlide = function() {
    showNextSlide();
  }

  var mannualChange = function() {
    if (intervalID) {
      clearInterval(intervalID);
      intervalID = 0;
    }

    if (timerID) {
      clearTimeout(timerID);
      timerID = 0;
    }

    timerID = window.setTimeout(() => {
      intervalID = window.setInterval(changeSlide, 5000);
    }, 10000);
  }

  var initSlider = function(sliderElem){
    var slidesElem = sliderElem.querySelectorAll('.slider__slide');
    slidesCount = slidesElem.length;
    slidesContainer = sliderElem.querySelector('.slider__slides');

    var prevButtonElem = sliderElem.querySelector('.slider__button--prev');
    prevButtonElem.addEventListener('click', () => {
      mannualChange();
      showPrevSlide();
    });

    var nextButtonElem = sliderElem.querySelector('.slider__button--next');
    nextButtonElem.addEventListener('click', () => {
      mannualChange();
      showNextSlide();
    });

    dots = sliderElem.querySelectorAll('.slider__dot');
    for(var i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click',
        (function(x) {
          return function() {
            mannualChange();
            showSlide(x);
          };
        })(i)
      );
    }

    intervalID = window.setInterval(changeSlide, 5000);
  }

  if (slider) initSlider(slider);
})();
