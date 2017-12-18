'use strict';

/**
 * Модуль для отрисовки увеличенного изображения
 */
(function () {
  window.evt = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === window.data.ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === window.data.ENTER_KEYCODE) {
        action();
      }
    }
  };
  // Показ/скрытие картинки в галерее
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  var pictures = document.querySelectorAll('.picture');

  var closeEscHandler = function (evt) {
    window.evt.isEscEvent(evt, closeOverlay);
  };

  var closeEnterHandler = function (evt) {
    window.evt.isEnterEvent(evt, closeOverlay);
  };

  var showOverlay = function (evt) {
    evt.preventDefault();
    var clickedElement = evt.currentTarget;
    galleryOverlay.querySelector('img.gallery-overlay-image').src = clickedElement.querySelector('img').src;
    galleryOverlay.querySelector('.likes-count').textContent = clickedElement.querySelector('.picture-likes').textContent;
    galleryOverlay.querySelector('.comments-count').textContent = clickedElement.querySelector('.picture-comments').textContent;
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', closeEscHandler);
    galleryOverlayClose.focus();
  };

  var closeOverlay = function () {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', closeEscHandler);
  };

  var photoClickHandler = function (evt) {
    showOverlay(evt);
  };

  for (var i = 0; i < pictures.length; i++) {
    pictures[i].addEventListener('click', photoClickHandler);
  }

  galleryOverlayClose.addEventListener('click', closeOverlay);
  galleryOverlayClose.addEventListener('keydown', closeEnterHandler);

})();
