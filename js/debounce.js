'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  /**
   * «Устраняем дребезг» при частом вызове функции
   * @param {function} fun - фугкция, которая должна выполниться после таймаута
   */
  window.debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };
})();
