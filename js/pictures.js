'use strict';

// ОБЩИЕ ФУНКЦИИ
var getRandomItem = function (arr) {
  return arr.splice([Math.floor(Math.random() * (arr.length))], 1).join();
};

var getRandomItemRange = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// Фунция, возвращает только одно значение
var getRandomArray = function (arr) {
  return arr[Math.floor(Math.random() * (arr.length))];
};

/* ПРОБЛЕМА!!! Функция, которая возвращает 1 или 2 значения в массив (не работает!!!)

  var getRandomArray = function (arr) {
    var newArr = [];
    for (i = 0; i < Math.floor((Math.random() * 2) + 1); i++) {
    newArr[i] = arr[Math.floor(Math.random() * (arr.length))];
  }
  return newArr;
}; */

// Глобальные переменные

var usersPhotos = [];
for (var i = 0; i < 25; i++) {
  usersPhotos[i] = i + 1;
}

var usersComments = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

// Создаем конструктор

var NewPhoto = function (numberPhoto, comments) {
  this.url = 'photos/' + getRandomItem(numberPhoto) + '.jpg';
  this.likes = getRandomItemRange(15, 200);
  this.comments = getRandomArray(comments);
};

// Создаем массив с постами пользователей
var usersPosts = [];
for (i = 0; i < 25; i++) {
  usersPosts[i] = new NewPhoto(usersPhotos, usersComments);
}

// Создаем DOM элементы;
var pictureTemplate = document.querySelector('#picture-template');
var picturesList = document.querySelector('.pictures').content;

// ПРОБЛЕМА!!!
var renderPhoto = function (photo) {
  var photoElement = pictureTemplate.cloneNode(true);
  photoElement.querySelector('img').src = photo.url;
  photoElement.querySelector('.picture-likes').textContent = photo.likes;
  photoElement.querySelector('.picture-comments').textContent = photo.comments.length;
  return photoElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < usersPosts.length; i++) {
  fragment.appendChild(renderPhoto(usersPosts[i]));
}

picturesList.appendChild(fragment);

// Показываем нужный элемент
var galleryOverlay = document.querySelector('.gallery-overlay');
galleryOverlay.querySelector('img.gallery-overlay-image').src = usersPosts[0].url;
galleryOverlay.querySelector('.likes-count').textContent = usersPosts[0].likes;
galleryOverlay.querySelector('.comments-count').textContent = usersPosts[0].comments.length;
galleryOverlay.classList.remove('hidden');
