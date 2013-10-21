/*jslint browser: true*/ /*global $, io */ /*exported socketQrCode */

var socketQrCode = (function () {
"use strict";

var socket;
var qrCodeSize = "180x180";
var port = window.location.port;

var _generateQrCodeImage = function (idSocket) {
  var urlApiGoogle = "http://chart.apis.google.com/chart?";
  urlApiGoogle += "chs="+ qrCodeSize + "&choe=UTF-8&cht=qr&chl=http://";
  urlApiGoogle += document.domain;
  urlApiGoogle += (typeof(port) !== "undefined") ? ":"+port : "";
  urlApiGoogle += "/qrcode/control.html?id="+ idSocket;
  return urlApiGoogle;
};

var _getSocketId = function () {
 return window.location.href.split("=")[1];
};

var initSocketIo = function () {
 socket = io.connect();
};

var initMobileClient = function () {
 socket.emit('controlerConnected', _getSocketId());
};

var dragablePlayer = function (selector) {
  $(selector).draggable({
    drag: function(){
      var offset = $(this).offset();
      var xPos = offset.left;
      var yPos = offset.top;
      socket.emit('movePlayer', { 'x' : xPos, 'y' : yPos, 'socketId':_getSocketId()});
    }
  });
};

var addSocketioCallBack = function () {
  socket.on('init', function (idSocket) {
    $(".bubblingG").hide();
    $("#qrcode").append("<img id='qrimage' src='" + _generateQrCodeImage(idSocket) +"'/>");
  });

  socket.on('updatePlayerPosition', function (player) {
    $('#player').css({ top:player.y , left:player.x });
  });

  socket.on('clientConnexion', function () {
    $('#container').hide();
    $('#player').show();
    $('#myModal').modal('show');
    setTimeout(function () {
      $('#myModal').modal('hide');
    }, 1000);
  });
};

return {
  initSocketIo : initSocketIo,
  addSocketioCallBack: addSocketioCallBack,
  dragablePlayer : dragablePlayer,
  initMobileClient : initMobileClient
};

})();
