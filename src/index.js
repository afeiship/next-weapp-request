(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var defaults = { responseType: 'json' };
  var normalize = function (inOptions) {
    var headers = inOptions.headers;
    var responseType = inOptions.responseType;
    headers['content-type'] = headers['Content-Type'];
    inOptions.data = inOptions.body;
    inOptions.header = headers;
    inOptions.responseType = responseType === 'json' ? 'text' : responseType;
    delete headers['Content-Type'];
    delete inOptions.headers;
    delete inOptions.body;
    return inOptions;
  };

  nx.weappRequest = function (inUrl, inOptions) {
    var options = nx.mix(null, { url: inUrl }, defaults, inOptions);
    options = normalize(options);
    return new Promise(function (resolve, reject) {
      wx.request(
        nx.mix(
          {
            success: function (res) {
              var responseType = options.responseType;
              res.data = responseType === 'text' && JSON.parse(res.data);
              resolve(res);
            },
            fail: reject
          },
          options
        )
      );
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = nx.weappRequest;
  }
})();
