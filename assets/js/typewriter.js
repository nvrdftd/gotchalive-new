var timer = 0;
var typewriter = function(text, _selector) {

  function intoPieces(i, text) {
    return text.slice(i, i+1);
  }

  function getRandom() {
    return Math.floor(Math.random() * 120);
  }

  function appendChar(i, text, _selector) {
    var char = intoPieces(i, text);
    i++;
    $(_selector).append(char);
    timer = setTimeout(appendChar, getRandom(), i, text, _selector)
  }

  if (text !== undefined) {
    var i = 0;
    if (timer) {
      clearTimeout(timer);
    }
    $(_selector).empty();
    appendChar(i, text, _selector);
  }
};
