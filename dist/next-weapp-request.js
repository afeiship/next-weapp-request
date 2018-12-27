(function() {
  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('next-js-core2');

  var NxWeappRequest = nx.declare('nx.WeappRequest', {
    statics: {
      parallel: { limit: 10, counter: 0 },
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
      parallel: function(inMethod, inUrl, inData, inOptions) {
        var self = this;
        var counter = NxWeappRequest.parallel.counter;
        var limit = NxWeappRequest.parallel.limit;
        var complete = (inOptions || {}).complete || nx.noop;
        var options = nx.mix(inOptions, {
          complete: function(res) {
            complete(res);
            NxWeappRequest.parallel.counter--;
          }
        });

        if (counter < limit) {
          NxWeappRequest.parallel.counter++;
          return this.request(inMethod, inUrl, inData, options);
        } else {
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              try {
                self.parallel(inMethod, inUrl, inData, options);
                resolve();
              } catch (_) {
                reject(_);
              }
            }, 300);
          });
        }
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
