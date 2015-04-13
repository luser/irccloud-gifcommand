/* Any copyright is dedicated to the Public Domain.
 http://creativecommons.org/publicdomain/zero/1.0/ */
/*global Promise, unsafeWindow */
// ==UserScript==
// @name irccloud gif command
// @namespace https://github.com/luser/irccloud-gifcommand
// @description Add a /gif command to irccloud
// @downloadURL https://raw.githubusercontent.com/luser/irccloud-gifcommand/master/irccloud_gif.user.js
// @version 1
// @match https://www.irccloud.com/*
// @match https://irccloud.mozilla.com/*
// @noframes
// ==/UserScript==

function getGIF(words) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.responseType = "json";
    req.onload = function() {
      if (req.response.meta.status != 200 ||
          !req.response.data.hasOwnProperty('images')) {
        reject("Failed");
      } else {
        resolve(req.response.data.images.downsized.url);
      }
    };
    req.onerror = function(e) {
      reject(e);
    };
    req.open('GET', 'https://api.giphy.com/v1/gifs/translate?s=' + encodeURIComponent(words) + '&api_key=dc6zaTOxFJmzC', true);
    req.send();
  });
}

var _COMMANDS = {
  gif: getGIF
};

var _oldsay = unsafeWindow.SESSIONVIEW.mainArea.current.input.__proto__.say;
unsafeWindow.SESSIONVIEW.mainArea.current.input.__proto__.say = function(m) {
  var cmd = m.split(' ')[0].substr(1);
  if (m.startsWith('/') && _COMMANDS.hasOwnProperty(cmd)) {
    this.clear();
    _COMMANDS[cmd](m.substr(cmd.length + 2)).then((newmsg) => {
      _oldsay.apply(this, [newmsg]);
    });
  } else {
    _oldsay.apply(this, [m]);
  }
}
