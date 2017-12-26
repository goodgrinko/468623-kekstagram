'use strict';

(function () {
  /**
   * Рассчитываем значение выбранного элемента
   * @param {DOM_element} scaleElement - input, который отвечает за значение изменяемого элемента
   * @param {boolean} plus - user хочет уменьшить значение (false) || увеличить (true)
   * @param {function} applyScale - применяем рассчитанный масштаб
   */
  window.initializeScale = function (scaleElement, plus, applyScale) {
    plus = plus || false;
    var min = Number(scaleElement.min.replace('%', ''));
    var max = Number(scaleElement.max.replace('%', ''));
    var step = Number(scaleElement.step.replace('%', ''));
    var scaleValue = Number(scaleElement.value.replace('%', ''));

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
    if (typeof applyScale === 'function') {
      applyScale(scaleValue);
    }
  };
})();
