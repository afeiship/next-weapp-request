(function() {
  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('next-js-core2');
  var NxQueue = nx.Queue || require('next-queue');

  var NxWeappRequest = nx.declare('nx.WeappRequest', {
    statics: {
      instance: null,
      getInstance: function() {
        if (!this.instance) {
          this.instance = new this();
        }
        return this.instance;
      }
    },
    methods: {
      getDefaults: function() {
        return {};
      },
      getHeaders: function() {
        return {};
      },
      setRequestInterceptor: function(inMethod, inUrl, inData, inOptions) {
        return inData;
      },
      setResponseInterceptor: function(inMethod, inUrl, inResponse, inOptions) {
        return inResponse;
      },
      setErrorInterceptor: function(inMethod, inUrl, inError, inOptions) {
        return inError;
      },
      parallel: function(inItems) {
        var fns = inItems.map(function(promiseItem) {
          return function(next) {
            promiseItem.then(function(response) {
              next(response);
            });
          };
        });
        var nxQueue = new NxQueue(fns);
        return nxQueue.start();
      },
      request: function(inMethod, inUrl, inData, inOptions) {
        var self = this;
        return new Promise(function(resolve, reject) {
          wx.request(
            nx.mix(
              {
                header: self.getHeaders(),
                method: inMethod.toUpperCase(),
                url: inUrl,
                data: self.setRequestInterceptor(inMethod, inUrl, inData, inOptions),
                success: function(response) {
                  var _response = self.setResponseInterceptor(inMethod, inUrl, response, inOptions);
                  resolve(_response);
                },
                fail: function(error) {
                  var _error = self.setErrorInterceptor(inMethod, inUrl, error, inOptions);
                  reject(_error);
                }
              },
              self.getDefaults(),
              inOptions
            )
          );
        });
      },
      'options,get,head,post,put,delete,trace,connect': function(inMethod) {
        var self = this;
        return function(inUrl, inData, inOptions) {
          return self.parallel(inMethod, inUrl, inData, inOptions);
        };
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxWeappRequest;
  }
})();
