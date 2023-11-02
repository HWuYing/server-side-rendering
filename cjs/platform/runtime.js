"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prov = exports.Input = exports.ApplicationPlugin = exports.Application = exports.PLATFORM_SCOPE = exports.dynamicPlatform = void 0;
var platform_1 = require("@fm/core/platform");
var token_1 = require("@fm/core/token");
var runtime_1 = require("@fm/csr/platform/runtime");
var index_1 = require("./index");
var _CORE_PLATFORM_PROVIDERS = [
    index_1.Platform,
    { provide: token_1.PLATFORM, useExisting: index_1.Platform }
];
var createPlatform = (0, platform_1.createPlatformFactory)(null, _CORE_PLATFORM_PROVIDERS);
var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return createPlatform(runtime_1.applicationContext, providers);
};
exports.dynamicPlatform = dynamicPlatform;
runtime_1.applicationContext.registerStart(function () { return (0, exports.dynamicPlatform)().bootstrapRender(runtime_1.applicationContext.providers); });
var application_1 = require("@fm/core/platform/application");
Object.defineProperty(exports, "PLATFORM_SCOPE", { enumerable: true, get: function () { return application_1.PLATFORM_SCOPE; } });
var runtime_2 = require("@fm/csr/platform/runtime");
Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return runtime_2.Application; } });
Object.defineProperty(exports, "ApplicationPlugin", { enumerable: true, get: function () { return runtime_2.ApplicationPlugin; } });
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return runtime_2.Input; } });
Object.defineProperty(exports, "Prov", { enumerable: true, get: function () { return runtime_2.Prov; } });
