'use strict';

// ОБЩИЕ ФУНКЦИИ

/**
 * Выбирает случайный неповторяющийся элемент массива
 * @param {Array} arr - массив, в котором ищем элемент
 * @return {String} случайный элемент массива
 */
var getRandomItem = function (arr) {
  return arr.splice([Math.floor(Math.random() * (arr.length))], 1).join();
};

/**
 * Выбирает случайное число из диапазона
 * @param {Number} min - нижняя граница диапазона
 * @param {Number} max - верхняя граница диапазона
 * @return {Number} случайное число из диапазона
 */
var getRandomRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

/**
 * Создает массив с 1 или 2мя случайными элементами
 * @param {Object} arr - входящий массив, в котором ищем элемент
 * @return {Object} сгенерированный массив
 */
var getRandomArray = function (arr) {
  var newArr = [];
  for (var i = 0; i < Math.floor((Math.random() * 2) + 1); i++) {
    newArr[i] = arr[Math.floor(Math.random() * (arr.length))];
  }
  return newArr;
};

// Глобальные переменные

var usersComments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var SUM_POSTS = 25;


var usersPhotos = [];
for (var i = 0; i < SUM_POSTS; i++) {
  usersPhotos[i] = i + 1;
}

/**
 * Создает пост с фото, лайками и комментариями
 * @constructor
 * @param {Object} numberPhoto - массив с номерами фото
 * @param {Object} comments - массив комментариев
 */
var NewPhoto = function (numberPhoto, comments) {
  this.url = 'photos/' + getRandomItem(numberPhoto) + '.jpg';
  this.likes = getRandomRange(MIN_LIKES, MAX_LIKES);
  this.comments = getRandomArray(comments);
};

// Создаем массив с постами пользователей
var usersPosts = [];
for (i = 0; i < SUM_POSTS; i++) {
  usersPosts[i] = new NewPhoto(usersPhotos, usersComments);
}

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
for (i = 0; i < usersPosts.length; i++) {
  fragment.appendChild(renderPhoto(usersPosts[i]));
}

picturesList.appendChild(fragment);

// Показ/скрытие картинки в галерее
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = document.querySelector('.gallery-overlay-close');
var pictures = document.querySelectorAll('.picture');

var closeEscHandler = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    closeOverlay();
  }
};

var closeEnterHandler = function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    closeOverlay();
  }
};

var showOverlay = function (event) {
  event.preventDefault();
  var clickedElement = event.currentTarget;
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

var photoClickHandler = function (event) {
  showOverlay(event);
};

for (i = 0; i < pictures.length; i++) {
  pictures[i].addEventListener('click', photoClickHandler);
}

galleryOverlayClose.addEventListener('click', closeOverlay);
galleryOverlayClose.addEventListener('keydown', closeEnterHandler);

// Показ/скрытие формы кадрирования
// TODO: При закрытии окна через ESC, форма не реагирует в дальнейшем на загрузку

var formUpload = document.querySelector('.upload-form');
var selectedFile = formUpload.querySelector('#upload-file');
var uploadOverlay = formUpload.querySelector('.upload-overlay');
var uploadOverlayClose = formUpload.querySelector('.upload-form-cancel');

var closeUploadEscHandler = function (event) {
  if (event.keyCode === ESC_KEYCODE && !formUpload.querySelector('textarea:focus')) {
    closeUploadOverlay();
  }
};

var closeUploadEnterHandler = function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    closeUploadOverlay();
  }
};

var showUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', closeUploadEscHandler);
};

var closeUploadOverlay = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', closeUploadEscHandler);
};

selectedFile.addEventListener('change', showUploadOverlay);
uploadOverlayClose.addEventListener('click', closeUploadOverlay);
uploadOverlayClose.addEventListener('keydown', closeUploadEnterHandler);

// Ограничение формы ввода масштаба && изменение масштаба изображения

var minusBtn = formUpload.querySelector('.upload-resize-controls-button-dec');
var plusBtn = formUpload.querySelector('.upload-resize-controls-button-inc');
var resizeElement = formUpload.querySelector('.upload-resize-controls-value');
var resizeValue = parseInt((formUpload.querySelector('.upload-resize-controls-value').value), 10);
var imagePreview = formUpload.querySelector('.effect-image-preview');

/**
 * Увеличивает масштаб фото с шагом 25%, максимальный маштаб 100%
 */
function zoomInHandler() {
  if (resizeValue < 100) {
    resizeValue = resizeValue + 25;
    var transformScale = 'scale(' + resizeValue / 100 + ')';
    imagePreview.style['transform'] = transformScale;
    resizeElement.value = String(resizeValue + '%');
  }
}

/**
 * Уменьшает масштаб фото с шагом 25%, минимальный масштаб 25%
 */
function zoomOutHandler() {
  if (resizeValue > 25) {
    resizeValue = resizeValue - 25;
    var transformScale = 'scale(' + resizeValue / 100 + ')';
    imagePreview.style['transform'] = transformScale;
    resizeElement.value = String(resizeValue + '%');
  }
}

minusBtn.addEventListener('click', zoomOutHandler);
plusBtn.addEventListener('click', zoomInHandler);

// Применение эффектов

var effectsImage = formUpload.querySelectorAll('.upload-effect-label');

/**
 * Применяет выбранный пользователем фильтр к фото
 * @param {*} event - нажатие на фото-превью с фильтром
 */
function addEffectImageHandler(event) {
  var idClickedEffect = event.currentTarget.previousElementSibling.id;
  idClickedEffect = idClickedEffect.substring(7);
  imagePreview.className = 'effect-image-preview ' + idClickedEffect;
}

for (i = 0; i <= effectsImage.length - 1; i++) {
  effectsImage[i].addEventListener('click', addEffectImageHandler, true);
}

// Хеш-теги
var hashTags = formUpload.querySelector('.upload-form-hashtags');

/**
 * Проверяет правильность заполненого поля с хэш-тегами
 * @param {Object} arr - массив с введенными хэш-тегами
 * @return {String} сообщение об ошибке или true
 */
function validateHashTags(arr) {

  for (i = 0; i < arr.length; i++) {
    // Хэш-тег начинается с символа `#` (решётка)
    if (arr[i][0] !== '#') {
      return 'Хеш-тег должен начинаться с # и состоять из одного слова';
    }
    // макс длина 20 символов
    if (arr[i].length > 20) {
      return 'Длина одного хэш-тега не может быть больше 20 символов';
    }
    // макс кол-во 5
    if (arr.length > 5) {
      return 'Нельзя указать больше 5 хэш-тегов';
    }
    // уникальность
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].toLowerCase() === arr[j].toLowerCase()) {
        return 'Хэш-теги не должны повторяться. ' +
          'Теги не чувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом';
      }
    }
  }
  return true;
}
// TODO: После изменения неправильных хэш-тегов, необходимо повторить проверку на валидность
formUpload.addEventListener('click', function (event) {
  event.preventDefault();

  if (hashTags.value === '') {
    formUpload.submit();
  } else {
    var messageValidation = validateHashTags(hashTags.value.split(' '));
    if (messageValidation !== true) {
      hashTags.classList.add('upload-message-error');
      hashTags.setCustomValidity(messageValidation);
    } else {
      formUpload.submit();
    }
  }
});
