"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextService = exports.dynamicPlatform = exports.JsonConfigService = void 0;
var json_config_1 = require("./json-config");
Object.defineProperty(exports, "JsonConfigService", { enumerable: true, get: function () { return json_config_1.JsonConfigService; } });
var platform_1 = require("./platform");
Object.defineProperty(exports, "dynamicPlatform", { enumerable: true, get: function () { return platform_1.dynamicPlatform; } });
var app_context_1 = require("./app-context");
Object.defineProperty(exports, "AppContextService", { enumerable: true, get: function () { return app_context_1.AppContextService; } });
