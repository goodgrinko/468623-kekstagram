'use strict';

(function () {
  // Показ/скрытие формы кадрирования
// TODO: При закрытии окна через ESC, форма не реагирует в дальнейшем на загрузку

  var formUpload = document.querySelector('.upload-form');
  var selectedFile = formUpload.querySelector('#upload-file');
  var uploadOverlay = formUpload.querySelector('.upload-overlay');
  var uploadOverlayClose = formUpload.querySelector('.upload-form-cancel');

  var closeEscHandler = function (evt) {
    if (evt.keyCode === window.data.ESC_KEYCODE && !formUpload.querySelector('textarea:focus')) {
      closeOverlay();
    }
  };

  var closeEnterHandler = function (evt) {
    window.evt.isEnterEvent(evt, closeEnterHandler);
  };

  var showUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', closeEscHandler);
  };

  var closeOverlay = function () {
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', closeEscHandler);
  };

  selectedFile.addEventListener('change', showUploadOverlay);
  uploadOverlayClose.addEventListener('click', closeOverlay);
  uploadOverlayClose.addEventListener('keydown', closeEnterHandler);

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
   * @param {*} evt - нажатие на фото-превью с фильтром
   */
  function addEffectImageHandler(evt) {
    var idClickedEffect = evt.currentTarget.previousElementSibling.id;
    idClickedEffect = idClickedEffect.substring(7);
    imagePreview.className = 'effect-image-preview ' + idClickedEffect;
  }

  for (var i = 0; i <= effectsImage.length - 1; i++) {
    effectsImage[i].addEventListener('click', addEffectImageHandler, true);
  }

  // Хеш-теги
  var hashTags = formUpload.querySelector('.upload-form-hashtags');
  var submitBtn = formUpload.querySelector('.upload-form-submit');
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
  // TODO: Не отображается подсказка при ошибке
  submitBtn.addEventListener('click', function (evt) {
    evt.preventDefault();

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
})();
