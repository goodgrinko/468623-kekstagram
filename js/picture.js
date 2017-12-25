'use strict';

/**
 * Модуль для отрисовки миниатюры
 */

(function () {
  // Создаем DOM элементы;
  var pictureTemplate = document.querySelector('#picture-template').content;
  var picturesList = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var data = [];
  /**
   * Рендерит фото на основе шаблона разметки
   * @param {Number} photo - номер элемента массива c постами пользователей
   * @return {Object} фото
   */
  var renderPhoto = function (photo) {
    var photoElement = pictureTemplate.cloneNode(true);
    photoElement.querySelector('img').src = photo.url;
    photoElement.querySelector('.picture-likes').textContent = photo.likes;
    photoElement.querySelector('.picture-comments').textContent = photo.comments.length;
    return photoElement;
  };

  // Вставляем фото в разметку
  var createGallery = function (array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(renderPhoto(array[i]));
    }
    picturesList.appendChild(fragment);
  };

  var successHandler = function (photos) {
    createGallery(photos);
    filters.classList.remove('filters-inactive');
    data = photos;
  };
  window.backend.load(successHandler, window.backend.errorHandler);
})();
