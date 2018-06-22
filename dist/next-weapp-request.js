(function () {

  var global = global || this || self || window;
  var nx = global.nx || require('next-js-core2');
  var EMPTY_OBJECT = {};

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
      getDefaults: function(){
        return EMPTY_OBJECT;
      },
      getHeaders: function () {
        return EMPTY_OBJECT;
      },
      setRequestInterceptor: function (inMethod, inUrl, inData, inOptions){
        return inData;
      },
      setResponseInterceptor: function (inMethod, inUrl, inResponse, inOptions){
        return inResponse;
      },
      setErrorInterceptor: function (inMethod, inUrl, inError, inOptions){
        return inError;
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
                var _response = self.setResponseInterceptor(inMethod, inUrl, response, inOptions);
                resolve(_response);
              },
              fail: function (error) {
                var _error = self.setErrorInterceptor(inMethod, inUrl, error, inOptions);
                reject(_error);
              }
            }, self.getDefaults(), inOptions)
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
