(function () {

  var global = global || this || self || window;
  var nx = global.nx || require('next-js-core2');

  var NxWeappRequest = nx.declare('nx.WeappRequest', {
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxWeappRequest;
  }

}());
