'use strict';

(function () {
  var SERVER_URL_POST = 'https://1510.dump.academy/kekstagram';
  var SERVER_URL_GET = 'https://1510.dump.academy/kekstagram/data';
  var SUCCESS_CODE = 200;
  var TIMEOUT_SERVER = 3000;

  var getXhr = function (successLoad, errorLoad) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT_SERVER;
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        successLoad(xhr.response);
      } else {
        errorLoad('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorLoad('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorLoad('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };

  window.backend = {
    load: function (loadHandler, errorLoad) {
      var xhr = getXhr(loadHandler, errorLoad);
      xhr.open('GET', SERVER_URL_GET);
      xhr.send();
    },
    save: function (data, loadHandler, errorLoad) {
      var xhr = getXhr(loadHandler, errorLoad);
      xhr.open('POST', SERVER_URL_POST);
      xhr.send(data);
    },
    errorLoad: function (errorMessage) {
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
