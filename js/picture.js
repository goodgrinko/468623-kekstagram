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
  var currentFilter = 'recommend';
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

  /**
   * Отрисовываем галлерею с отсортированным массивом фото
   */
  var createGallery = function () {
    clearGallery();
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < sortedPhotos.length; i++) {
      fragment.appendChild(renderPhoto(sortedPhotos[i]));
    }
    picturesList.appendChild(fragment);
  };
  /**
   * Чистим галерею для новой сортировки
   */
  var clearGallery = function () {
    while (picturesList.firstChild) {
      picturesList.removeChild(picturesList.firstChild);
    }
  };
  /**
   * Отрисовываем галерею в случае успешной загрузки данных с сервера
   * @param {XMLHttpRequest} photos
   */
  var successLoad = function (photos) {
    originalPhotos = photos;
    sortedPhotos = photos.slice(0);
    createGallery();
    filters.classList.remove('filters-inactive');
  };
  /**
   * Загружаем данные с сервера и отрисовываем галерею
   */
  window.backend.load(successLoad, window.backend.errorHandler);
  /**
   * Сортируем фото
   * @param {event} evt
   */
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
