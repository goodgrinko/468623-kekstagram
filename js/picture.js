'use strict';

/**
 * Модуль для отрисовки миниатюры
 */

(function () {
  // Создаем DOM элементы;
  var pictureTemplate = document.querySelector('#picture-template').content;
  var picturesList = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var sortedPhotos = [];
  var originalPhotos = [];

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
  var createGallery = function () {
    clearGallery();
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < sortedPhotos.length; i++) {
      fragment.appendChild(renderPhoto(sortedPhotos[i]));
    }
    picturesList.appendChild(fragment);
  };

  var clearGallery = function () {
    while (picturesList.firstChild) {
      picturesList.removeChild(picturesList.firstChild);
    }
  };
  var successHandler = function (photos) {
    originalPhotos = photos;
    sortedPhotos = photos.slice(0);
    createGallery();
    filters.classList.remove('filters-inactive');
  };
  window.backend.load(successHandler, window.backend.errorHandler);
  var currentFilter = 'recommend';

  var filterPhotos = function (evt) {
    if (evt.target.type !== 'radio') {
      return;
    }
    var filter = evt.target.value;
    if (filter === currentFilter && filter !== 'random') {
      return;
    }
    switch (filter) {
      // Популярные фотографии
      case 'popular':
        sortedPhotos = originalPhotos.slice(0).sort(function (first, second) {
          return second.likes - first.likes;
        });
        break;
      // Обсуждаемые фотографии
      case 'discussed':
        sortedPhotos = originalPhotos.slice(0).sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
        break;
      // Случайные
      case 'random':
        var copyData = originalPhotos.slice(0);
        sortedPhotos = [];
        while (copyData.length > 0) {
          var indexElement = Math.floor(Math.random() * copyData.length);
          sortedPhotos.push(copyData.splice(indexElement, 1)[0]);
        }
        break;
      // Рекомендуемые
      case 'recommend':
      default:
        sortedPhotos = originalPhotos.slice(0);
    }
    window.debounce(createGallery);
    currentFilter = filter;
  };

  filters.addEventListener('click', function (evt) {
    filterPhotos(evt);
  });
})();
