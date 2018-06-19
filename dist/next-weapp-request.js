(function () {

  var global = global || this || self || window;
  var nx = global.nx || require('next-js-core2');

  var NxWeappRequest = nx.declare('nx.WeappRequest', {
    methods: {
      getHeaders: function () {
        return {};
      },
      request: function (inMethod, inUrl, inData, inOptions) {
        var self = this;
        return new Promise(function (resolve, reject) {
          wx.request(
            nx.mix({
              headers: self.getHeaders(),
              method: inMethod.toUpperCase(),
              url: inUrl,
              data: inData,
              success: function (response) {
                resolve(response);
              },
              fail: function (error) {
                reject(error);
              }
            }, inOptions)
          );
        });
      },
      'options,get,head,post,put,delete,trace,connect': function (inMethod) {
        var self = this;
        return function (inUrl, inData, inOptions) {
          return self.request(inMethod, inUrl, inData, inOptions);
        }
      }
    }
  });


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxWeappRequest;
  }

}());
