"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var modules = ["/Private/thirdparty.js", "/Private/three.js", "/Private/Web2d.js", "/Private/Editor.js", "/Private/WebViewer.js", "/Private/WebViewer.plugins.js", "/Private/bimface.bufferfly.js", "/Private/mdvDrawing2D.js", "/Private/bimcube.js"];

var transformFullUrl = function transformFullUrl(baseUrl, modules$$1) {
  for (var i = 0; i < modules$$1.length; i++) {
    modules$$1[i] = baseUrl + modules$$1[i];
  }
};

var isDrawingView = function isDrawingView(data, options) {
  return data.renderType == "drawingView" || options.viewType == BimfaceViewTypeOption.DrawingView;
};

//获取需要加载的js/css资源
var getLoadModules = function getLoadModules(configurations) {
  var sdkVersion = configurations.sdkVersion;
  var uiVersion = configurations.uiVersion;
  var options = configurations.options;
  var configuration = options.configuration;

  var debugModules = ["/Bimface/Bimface.css", "/Bimface/Bimface.js", "/Application/Application.js", "/Drawing/Drawing.js"];
  var sdkModules = [];

  if (options.build === BimfaceConfigrationOption.Debug) {
    if (options.dataPath) {
      sdkModules = [].concat(modules, debugModules);
    } else {
      sdkModules = modules;
    }
  }
  var commonModules = ["/" + sdkVersion + "/" + options.language + ".js", "/" + uiVersion + "/Application" + configuration + ".js"];
  if (isDrawingView(configurations.metadata, configurations.options)) {
    sdkModules = [].concat(_toConsumableArray(sdkModules), commonModules, ["/" + sdkVersion + "/Drawing.css", "/" + sdkVersion + "/bimface.bufferfly.js", "/" + sdkVersion + "/Drawing" + configuration + ".js"]);
  } else {
    sdkModules = [].concat(_toConsumableArray(sdkModules), commonModules, ["/" + sdkVersion + "/Bimface.css", "/" + sdkVersion + "/thirdparty.js", "/" + sdkVersion + "/Bimface" + configuration + ".js"]);
  }

  return sdkModules;
};

var postProcessing = function postProcessing(configurations) {
  var data = configurations.metadata;
  var options = configurations.options;
  var successCb = configurations.successCb;

  var sdkModules = getLoadModules(configurations);
  transformFullUrl(options.staticHost, sdkModules);

  data.databagId = "" + data.databagId;

  if (options.path) {
    data.path = options.path;
    data.dataPath = "./";
  } else if (options.resourcePath) {
    data.path = options.resourcePath.replace('viewToken', '');
  }
  data.sdkPath = options.sdkPath;

  if (sdkModules.length == 0) {
    successCb(data);
  } else {
    loadResource(sdkModules, function () {
      if (options.build === BimfaceConfigrationOption.Debug && options.dataPath) {
        var arr = options.dataPath.split("/");
        successCb({
          databagId: arr.pop(),
          path: arr.join("/")
        });
      }
      successCb(data);
    });
  }
};

window.postProcessing = postProcessing;