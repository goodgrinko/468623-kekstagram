'use strict';

(function () {
  /**
   * Рассчитываем значение выбранного элемента
   * @param {DOM_Element} scaleElement - input, который отвечает за значение изменяемого элемента
   * @param {boolean} plus - user хочет уменьшить значение (false) || увеличить (true)
   * @return {number} вычисленное значение
   */
  var getScaleValue = function (scaleElement, plus) {
    plus = plus || false;
    var min = Number(scaleElement.getAttribute('min').replace('%', ''));
    var max = Number(scaleElement.getAttribute('max').replace('%', ''));
    var step = Number(scaleElement.getAttribute('step').replace('%', ''));
    var scaleValue = Number(scaleElement.getAttribute('value').replace('%', ''));

    if (plus) {
      scaleValue += step;
      if (scaleValue > max) {
        scaleValue = max;
      }
    } else {
      scaleValue -= step;
      if (scaleValue < min) {
        scaleValue = min;
      }
    }

    return scaleValue;
  };

  /**
   * Отслеживает клик по элементу для изменения масштаба
   * @param {DOM_Element} clickedElement - UI элемент, который изменяет user
   * @param {DOM_Element} scaleElement - input, который содержит значение масштаба
   * @param {boolean} plus - увеличить (true) || уменьшить (false)
   * @param {function} applyScale - отображаем изменение элемента в UI
   */
  window.initializeScale = function (clickedElement, scaleElement, plus, applyScale) {
    clickedElement.addEventListener('click', applyScale(getScaleValue(scaleElement, plus)));
  };
})();
