# next-weapp-request

> A request wrapper for weapp wxRequest

## usage:

```js
// http.js
import NxWeappRequest from "next-weapp-request";

export default nx.declare({
  extends: NxWeappRequest,
  methods: {
    getHeaders: function() {
      return {
        "content-type": nx.contentType("urlencoded")
      };
    },
    setResponseInterceptor: function(inMethod, inUrl, inData, inOptions) {
      return inData.data.data;
    },
    setRequestInterceptor: function(inMethod, inUrl, inData, inOptions) {
      return nx.param(inData);
    },
    setErrorInterceptor: function(inMethod, inUrl, inData, inOptions) {
      return inData;
    }
  }
});


// my bussiness module:
import $http from "./http";

$http.get("/v1/test/1").then(res => {
  console.log("list data:", res);
});

$http.post("/v1/create/1").then(res => {
  console.log("create success", res.id);
});
```
