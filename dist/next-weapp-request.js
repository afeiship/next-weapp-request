(function () {

  var global = global || this || self || window;
  var nx = global.nx || require('next-js-core2');

  var NxWeappRequest = nx.declare('nx.WeappRequest', {
    statics: {
      instance: null,
      getInstance: function () {
        if (!this.instance) {
          this.instance = new this();
        }
        return this.instance;
      }
    },
    methods: {
      getHeaders: function () {
        return {};
      },
      setRequestInterceptor: function (inMethod, inUrl, inData, inOptions){
        return inData;
      },
      setResponseInterceptor: function (inMethod, inUrl, inResponse, inOptions){
        return inResponse;
      },
      request: function (inMethod, inUrl, inData, inOptions) {
        var self = this;
        return new Promise(function (resolve, reject) {
          wx.request(
            nx.mix({
              header: self.getHeaders(),
              method: inMethod.toUpperCase(),
              url: inUrl,
              data: self.setRequestInterceptor(inMethod, inUrl, inData, inOptions),
              success: function (response) {
                var _response = self.setResponseInterceptor(response);
                resolve(_response);
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
