'use strict';
(function () {
  // ГЛОБАЛЬНЫЕ ДАННЫЕ
  window.data = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    usersPosts: [],
    /**
     * Выбирает случайный неповторяющийся элемент массива
     * @param {Array} arr - массив, в котором ищем элемент
     * @return {String} случайный элемент массива
     */
    getRandomItem: function (arr) {
      return arr.splice([Math.floor(Math.random() * (arr.length))], 1).join();
    },
    /**
     * Выбирает случайное число из диапазона
     * @param {Number} min - нижняя граница диапазона
     * @param {Number} max - верхняя граница диапазона
     * @return {Number} случайное число из диапазона
     */
    getRandomRange: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    /**
     * Создает массив с 1 или 2мя случайными элементами
     * @param {Object} arr - входящий массив, в котором ищем элемент
     * @return {Object} сгенерированный массив
     */
    getRandomArray: function (arr) {
      var newArr = [];
      for (var i = 0; i < Math.floor((Math.random() * 2) + 1); i++) {
        newArr[i] = arr[Math.floor(Math.random() * (arr.length))];
      }
      return newArr;
    }
  };
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var SUM_POSTS = 25;

  var usersComments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

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
    this.url = 'photos/' + window.data.getRandomItem(numberPhoto) + '.jpg';
    this.likes = window.data.getRandomRange(MIN_LIKES, MAX_LIKES);
    this.comments = window.data.getRandomArray(comments);
  };

  var usersPostsArr = [];
  for (i = 0; i < SUM_POSTS; i++) {
    usersPostsArr[i] = new NewPhoto(usersPhotos, usersComments);
  }
  window.data.usersPosts = usersPostsArr;
})();
