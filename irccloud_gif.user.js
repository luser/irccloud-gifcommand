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

var _oldsay = SESSIONVIEW.mainArea.current.input.__proto__.say;
SESSIONVIEW.mainArea.current.input.__proto__.say = function(m) {
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
