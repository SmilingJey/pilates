'use strict';

(function(){
  var ESC_KEY = 27;
  var openClass = 'modal--show';
  var showed = false;

  var registerModal = document.querySelector('.register');
  var closeButton = registerModal.querySelector('.modal__close');

  var onEsc = function (evt) {
    if (evt.keyCode === ESC_KEY) {
      closeModal();
      evt.preventDefault();
    }
  }

  var closeModal = function() {
    registerModal.classList.remove(openClass);
    window.removeEventListener("keydown", onEsc);
  }
  closeButton.addEventListener('click', closeModal);

  var showModal = function() {
    window.addEventListener("keydown", onEsc);
    registerModal.classList.add(openClass);
    showed = true;
  }

  setTimeout(function() {
    if (!showed) showModal();
  },15000);

  var registerButtons = document.querySelectorAll('.price-card__link');

  registerButtons.forEach( (button) => {
    button.addEventListener('click', function (evt) {
      showModal();
      evt.preventDefault();
    });
  });


})();
