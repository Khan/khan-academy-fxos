define(["JSXTransformer","text"],function(e,t){"use strict";var n={};var r={version:"0.2.2",load:function(r,i,s,o){var u=o.jsx&&o.jsx.fileExtension||".js";var a=function(t){try{if(-1===t.indexOf("@jsx React.DOM")){t="/** @jsx React.DOM */\n"+t}t=e.transform(t).code}catch(i){s.error(i)}if(o.isBuild){n[r]=t}else{t+="\n//# sourceURL="+location.protocol+"//"+location.hostname+o.baseUrl+r+u}s.fromText(t)};t.load(r+u,i,a,o)},write:function(e,t,r){if(n.hasOwnProperty(t)){var i=n[t];r.asModule(t,i)}}};return r})