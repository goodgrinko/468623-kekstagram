'use strict';

/**
 * Модуль загрузки фото
 */
(function () {
  // Показ/скрытие формы кадрирования
  // TODO: При закрытии окна через ESC, форма не реагирует в дальнейшем на загрузку

  var formUpload = document.querySelector('.upload-form');
  var selectedFile = formUpload.querySelector('#upload-file');
  var uploadOverlay = formUpload.querySelector('.upload-overlay');
  var uploadOverlayClose = formUpload.querySelector('.upload-form-cancel');

  /**
   * Закрывает окно при нажатии Esc или Enter
   * Если фокус находится на форме ввода комментария, то форма закрываться не должна
   * @param {*} evt
   */
  var closeKeyHandler = function (evt) {
    if (!formUpload.querySelector('textarea:focus')) {
      window.evt.isKeyEvent(evt, closeOverlay);
    }
  };

  /**
   * Показывает форму для отправки фото
   */
  var showUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    displayEffectControls();
    document.addEventListener('keydown', closeKeyHandler);
  };

  /**
   * Закрывает форму для отправки фото !БЕЗ отправки
   */
  var closeOverlay = function () {
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', closeKeyHandler);
  };

  selectedFile.addEventListener('change', showUploadOverlay);
  uploadOverlayClose.addEventListener('click', closeOverlay);
  uploadOverlayClose.addEventListener('keydown', closeKeyHandler);

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
   * @param {Object} tags - массив с введенными хэш-тегами
   * @return {String} сообщение об ошибке или true
   */
  function validateHashTags(tags) {

    for (i = 0; i < tags.length; i++) {
      // Хэш-тег начинается с символа `#` (решётка)
      if (tags[i][0] !== '#') {
        return 'Хеш-тег должен начинаться с # и состоять из одного слова';
      }
      // макс длина 20 символов
      if (tags[i].length > 20) {
        return 'Длина одного хэш-тега не может быть больше 20 символов';
      }
      // макс кол-во 5
      if (tags.length > 5) {
        return 'Нельзя указать больше 5 хэш-тегов';
      }
      // уникальность
      for (var j = i + 1; j < tags.length; j++) {
        if (tags[i].toLowerCase() === tags[j].toLowerCase()) {
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
  // Ползунок интенсивности фильтра
  var rangePin = formUpload.querySelector('.upload-effect-level-pin');
  var effectControls = formUpload.querySelector('.upload-effect-level');
  var defaultRangePinLeft = rangePin.style.left;
  var rangeValue = formUpload.querySelector('.upload-effect-level-value');
  var defaultRangeValue = rangeValue.value;
  var rangeLine = formUpload.querySelector('.upload-effect-level-line');
  var rangeBar = formUpload.querySelector('.upload-effect-level-val');
  var defaultRangeBarWidth = rangeBar.style.width;
  var currentFilter = '';

  var startX;
  var cursorLeftLimit;
  var cursorRightLimit;

  /**
   * Меняет насыщенность текущего выбранного фильтра
   * @param {Number} value - число, которое соответствует положению пина
   */
  var changeEffectValue = function (value) {
    var newFilter;
    switch (currentFilter) {
      case 'effect-chrome':
        newFilter = 'grayscale(' + value / 100 + ')'; // 0..1
        break;
      case 'effect-sepia':
        newFilter = 'sepia(' + value / 100 + ')'; // 0..1
        break;
      case 'effect-marvin':
        newFilter = 'invert(' + value + '%)'; // 0..100%
        break;
      case 'effect-phobos':
        newFilter = 'blur(' + value / 33.33 + 'px)'; // 0..3px
        break;
      case 'effect-heat':
        newFilter = 'brightness(' + value / 33.33 + ')'; // 0..3
        break;
      default:
        newFilter = '';
    }
    imagePreview.style.filter = newFilter;
  };
  /**
   * Применяет фильтр с выбранной насыщенностью
   * @param {*} evt -
   */
  var applyEffect = function (evt) {
    rangeValue.value = defaultRangeValue;
    rangePin.style.left = defaultRangePinLeft;
    rangeBar.style.width = defaultRangeBarWidth;

    if (currentFilter.length > 0) {
      imagePreview.classList.remove(currentFilter);
    }
    currentFilter = evt.target.parentNode.htmlFor.replace('upload-', '');
    changeEffectValue(defaultRangeValue);
  };
  /**
   * Отображает применение эффекта на большом фото
   */
  var displayEffectControls = function () {
    if (currentFilter.length === 0 || currentFilter === 'effect-none') {
      effectControls.classList.add('hidden');
    } else {
      effectControls.classList.remove('hidden');
    }
  };
  /**
   * Задаем начальную позицию курсора и добавляем события на действия мышки
   */
  rangePin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    startX = evt.clientX;
    cursorLeftLimit = -1;
    cursorRightLimit = -1;

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
  /**
   * Фиксируем перемещение мыши
   * @param {*} moveEvt действия мышки
   */
  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();

    if (((cursorLeftLimit !== -1) && moveEvt.clientX < cursorLeftLimit)
      || ((cursorRightLimit !== -1) && moveEvt.clientX > cursorRightLimit)) {
      return;
    }
    var shiftX = startX - moveEvt.clientX;
    startX = moveEvt.clientX;

    var newValue = rangePin.offsetLeft - shiftX;
    if (newValue < 0) {
      newValue = 0;
      cursorLeftLimit = moveEvt.clientX;
    }
    if (newValue > rangeLine.clientWidth) {
      newValue = rangeLine.clientWidth;
      cursorRightLimit = moveEvt.clientX;
    }

    var newValueProcent = Math.round(newValue / (rangeLine.clientWidth / 100));
    rangeValue.value = newValueProcent;
    rangePin.style.left = newValue + 'px';
    rangeBar.style.width = newValueProcent + '%';
    changeEffectValue(newValueProcent);
  };
  /**
   * Фиксируем остановку перемещение мыши
   * @param {*} upEvt отпускание клавиши мыши
   */
  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  document.querySelector('#upload-select-image').addEventListener('click', function (evt) {
    if (evt.target.classList.contains('upload-effect-preview')) {
      applyEffect(evt);
      displayEffectControls();
    }
  });
})();
