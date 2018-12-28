/** wepy app.js */
var RequestMQ = {
  map: {},
  mq: [],
  running: [],
  MAX_REQUEST: 5,
  push: function push(param) {
    param.t = +new Date();
    while (this.mq.indexOf(param.t) > -1 || this.running.indexOf(param.t) > -1) {
      param.t += (Math.random() * 10) >> 0;
    }
    this.mq.push(param.t);
    this.map[param.t] = param;
  },
  next: function next() {
    var me = this;

    if (this.mq.length === 0) return;

    if (this.running.length < this.MAX_REQUEST - 1) {
      var newone = this.mq.shift();
      var obj = this.map[newone];
      var oldComplete = obj.complete;
      obj.complete = function() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        me.running.splice(me.running.indexOf(obj.t), 1);
        delete me.map[obj.t];
        oldComplete && oldComplete.apply(obj, args);
        me.next();
      };
      this.running.push(obj.t);
      return wx.request(obj);
    }
  },
  request: function request(obj) {
    obj = obj || {};
    obj = typeof obj === 'string' ? { url: obj } : obj;

    this.push(obj);

    return this.next();
  }
};
