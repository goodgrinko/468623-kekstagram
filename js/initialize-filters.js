'use strict';

(function () {
  /**
   * Применяем выбранный фильтр к фото
   * @param {DOM_element} clickedElement - фильтр, который выбрал пользователь
   * @param {function} applyFunction - функция, которая применяет фильтр
   * @param {function} displayFunction - отображает применение фильтра в UI
   */
  window.initializeFilters = function (clickedElement, applyFunction, displayFunction) {
    clickedElement.addEventListener('click', function (evt) {
      if (evt.target.classList.contains('upload-effect-preview')) {
        applyFunction(evt);
        displayFunction();
      }
    });
  };
})();
