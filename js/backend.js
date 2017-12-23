'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/kekstagram';
  var SUCCESS_CODE = 200;
  var TIMEOUT_SERVER = 3000;

  var getXhr = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError(xhr.response[0].errorMessage);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = getXhr(onLoad, onError);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = getXhr(onLoad, onError);
      xhr.open('POST', SERVER_URL);
      xhr.send(data);
    },
    onError: function (errorMessage) {
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
