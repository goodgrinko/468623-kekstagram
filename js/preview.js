'use strict';

/**
 * Модуль для отрисовки увеличенного изображения
 */
(function () {
  window.evt = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    /**
     * Выполняет заданное действие при нажатии Esc или Enter
     * @param {event} evt - отслеживаемое событие по клавишам Esc или Enter
     * @param {function} action - действие, которое необходимо выполнить
     */
    isKeyEvent: function (evt, action) {
      if (evt.keyCode === window.evt.ESC_KEYCODE || window.evt.ENTER_KEYCODE) {
        action();
      }
    }
  };
  // Показ/скрытие картинки в галерее
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  /**
   * Закрытие окна при нажатии Esc или Enter
   * @param {event} evt - отслеживаемое событие по клавишам Esc или Enter
   */
  var closeKeyHandler = function (evt) {
    window.evt.isKeyEvent(evt, closeOverlay);
  };
  /**
   * Показывает увеличенное выбранное изображение
   * @param {event} evt отслеживаемое событие
   */
  var showOverlay = function (evt) {
    evt.preventDefault();
    var clickedElement = evt.target.parentNode;
    galleryOverlay.querySelector('img.gallery-overlay-image').src = clickedElement.querySelector('img').src;
    galleryOverlay.querySelector('.likes-count').textContent = clickedElement.querySelector('.picture-likes').textContent;
    galleryOverlay.querySelector('.comments-count').textContent = clickedElement.querySelector('.picture-comments').textContent;
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', closeKeyHandler);
    galleryOverlayClose.focus();
  };
  /**
   * Закрытие окна с увеличенным фото
   */
  var closeOverlay = function () {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', closeKeyHandler);
  };
  /**
   * Цикл, который добавляет отслеживание клика на каждое фото
   * @param {array} photos - массив c фото
   */
  var showPreviewHandler = function (photos) {
    for (var i = 0; i < photos.length; i++) {
      photos[i].addEventListener('click', showOverlay);
    }
  };
  showPreviewHandler(document.querySelectorAll('.pictures'));
  galleryOverlayClose.addEventListener('click', closeOverlay);
  galleryOverlayClose.addEventListener('keydown', closeKeyHandler);
})();
