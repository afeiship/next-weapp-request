var MqMini = {
  map: {},
  mq: [],
  running: [],
  request: function(inOptions) {
    this.push(inOptions);
    this.next();
  },
  push: function(inOptions) {
    var options = inOptions || {};
    options.t = +new Date();
    // 这里的逻辑就是一定得产生一个随机数，而且是时间递增的
    // 符合这两个条件中的任何一个，就表示，产生的和之前的是一样的，典型的并发场景； 这种情况需要继续算随机数
    while (this.mq.indexOf(options.t) > -1 || this.running.indexOf(options.t) > -1) {
      options.t += (Math.random() * 10) >> 0;
    }

    // 随机数算好了，即可以继续加到 map 中去了
    this.mq.push(options.t);
    this.map[options.t] = options;
  },
  next: function() {
    var me = this;
    // 如果 quue 中没有东西了，直接返回，啥也不做
    if (this.mq.length === 0) return;

    // running 中有值，且，这个时候总的 lenght 小于我们定义的最大并发数，就可以继续执行
    if (this.running.length < this.MAX_REQUEST - 1) {
      // 取出数组的第一个，并把第一个从数组中删除
      var newone = this.mq.shift();
      // 通过那个时间随机数，得到真正存储好的 options （请求参数）
      var obj = this.map[newone];
      // 取出原来的 complete:
      var oldComplete = obj.complete;
      obj.complete = function() {
        // 取出参数 complete 的返回值, 看下面的，好像直接可以用 arguments:
        me.running.splice(me.running.indexOf(obj.t), 1);
        delete me.map[obj.t];
        oldComplete && oldComplete.apply(obj, arguments);
        me.next();
      };

      // 在  running 的时候，把这个加到 running 中去；
      // 真正开始并发执行你的方法
      this.running.push(obj.t);
      return wx.request(obj);
    }
  }
};
