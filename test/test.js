"use strict"

var createPageStore = require("../zpage.js")

require("tape")("morton-page", function(t) {
  var pageStore = createPageStore(2, 4)

  pageStore.add({key: [10, 10], value: "foo"})
  pageStore.add({key: [0, 0], value: "abc"})
  pageStore.add({key: [16, 16], value: "def"})

  var x = pageStore.get(10, 10)
  t.equals(x.value, "foo")
  pageStore.remove(10, 10)
  t.equals(pageStore.get(10,10), null)

  t.equals(pageStore.get(0,0).value, "abc")
  t.equals(pageStore.get(16,16).value, "def")
  
  pageStore.remove(16,16)
  t.equals(pageStore.get(16,16), null)

  t.end()
})
