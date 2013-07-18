"use strict"

var isProperty = require("is-property")
var interleave = require("bit-interleave")

function createPageConstructor(n, page_bits, page_shift, key) {
  var arglist = new Array(n)
  for(var i=0; i<n; ++i) {
    arglist[i] = "x"+i
  }
  
  var useDot = isProperty(key)
  var keyStr = useDot ? "." + key : "['" + key + "']"

  var code = ["'use strict'"]
  var className = ["MortonCache", n, "b", page_bits].join("")

  //Create constructor
  code.push(["function ",className,"(sz){",
    "this.pages=new Array(",1<<page_bits,");",
    "for(var i=0;i<",1<<page_bits,";++i){this.pages[i]=[]};",
  "}"].join(""))
  
  code.push(["var proto=",className,".prototype"].join(""))
  code.push("proto.bits="+page_bits)
  code.push("proto.shift="+page_shift)
  code.push("proto.key='" + key + "'")
  
  //pages.add():
  code.push("proto.add=function(page){")
    code.push(["this.pages[(interleave.apply(undefined, page", keyStr, ")>>",page_shift,")&",(1<<page_bits)-1,"].push(page)"].join(""))
  code.push("}")
  
  //pages.get():
  var matched = []
  for(var i=0; i<n; ++i) {
    matched.push(["(k[",i,"]===",arglist[i],")"].join(""))
  }
  code.push(["proto.get=function(",arglist.join(","),"){",
    "var pages=this.pages[(interleave(",arglist.join(","),")>>",page_shift,")&",(1<<page_bits)-1,"],n=pages.length;",
    "for(var i=0;i<n;++i){",
      "var p=pages[i],k=p", keyStr, ";",
      "if(",matched.join("&&"),"){ return p }",
    "}",
    "return null }"
  ].join(""))
  
  //pages.remove():
  code.push(["proto.remove=function(", arglist.join(","), "){",
    "var pages=this.pages[(interleave(", arglist.join(","), ")>>",page_shift,")&", (1<<page_bits)-1,"],n=pages.length;",
    "for(var i=0;i<n;++i){",
      "var k=pages[i]", keyStr, ";",
      "if(", matched.join("&&"), "){pages[i]=pages[pages.length-1];pages.pop();break;}",
    "}",
  "}"
  ].join(""))
  
  code.push("return " + className)
  
  //Compile procedure
  var proc = new Function("interleave", code.join("\n"))
  return proc(interleave[n])
}

var CACHE = {}
function createPageCache(dimension, bits, shift, key) {
  shift = shift || 0
  key = key || "key"
  key = key.replace(/\'/g, "\\'")

  var name = [dimension, bits, shift, key].join(":")
  var ctor = CACHE[name]
  if(ctor) {
    return new ctor()
  }
  ctor = createPageConstructor(dimension, bits, shift, key)
  CACHE[name] = ctor
  return new ctor()
}

module.exports = createPageCache