'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/kekstagram';
  var SUCCESS_CODE = 200;
  var TIMEOUT_SERVER = 3000;

  var getXhr = function (loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };

  window.backend = {
    load: function (loadHandler, errorHandler) {
      var xhr = getXhr(loadHandler, errorHandler);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    save: function (data, loadHandler, errorHandler) {
      var xhr = getXhr(loadHandler, errorHandler);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.classList.add('error-message');
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
      setTimeout(function () {
        document.body.firstChild.classList.add('hidden');
      }, TIMEOUT_SERVER);
    }
  };
})();
