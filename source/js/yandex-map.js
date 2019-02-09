'use strict';

(function(){

  var yandexMap = document.querySelector("#yandex-map");
  if (yandexMap) {
    try {
      ymaps.ready(init);
      function init(){
          var myMap = new ymaps.Map("yandex-map", {
              center: [44.830304, 41.405822], // Координаты центра карты.
              zoom: 17, // Уровень масштабирования (0 - 19)
              controls: []
          });

          var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Пилатес',
            balloonContent: 'Россия, г. Кропоткин, ул. Дугинец 10а'
          }, {
            iconLayout: 'default#image', // тип макета.
            iconImageHref: 'img/map-pin.svg', // изображение иконки метки
            iconImageSize: [24, 35], // Размеры метки.
            iconImageOffset: [-12, -35] // Смещение левого верхнего угла иконки относительно
          });

          myMap.geoObjects.add(myPlacemark);
      }

      yandexMap.classList.remove("contacts__map--nojs");
    } catch (e) {
      console.log("невозможно отобразить яндекс карты");
    }
  }
})();

