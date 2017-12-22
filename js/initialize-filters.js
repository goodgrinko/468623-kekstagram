'use strict';

(function () {
  window.initializeFilters = function (clickedElement, applyFunction, displayFunction) {
    clickedElement.addEventListener('click', function (evt) {
      if (evt.target.classList.contains('upload-effect-preview')) {
        applyFunction(evt);
        displayFunction();
      }
    });
  };
})();
