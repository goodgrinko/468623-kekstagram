'use strict';

/**
 * Модуль для отрисовки миниатюры
 */

(function () {
  // Создаем DOM элементы;
  var pictureTemplate = document.querySelector('#picture-template').content;
  var picturesList = document.querySelector('.pictures');

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
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < window.data.usersPosts.length; i++) {
    fragment.appendChild(renderPhoto(window.data.usersPosts[i]));
  }

  picturesList.appendChild(fragment);
})();
