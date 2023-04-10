"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prov = exports.Input = exports.Application = exports.PLATFORM_SCOPE = exports.dynamicPlatform = void 0;
var platform_1 = require("@fm/core/providers/platform");
var token_1 = require("@fm/core/token");
var platform_2 = require("@fm/csr/providers/platform");
var di_1 = require("@fm/di");
var platform_3 = require("./platform");
var _CORE_PLATFORM_PROVIDERS = [
    { provide: platform_3.Platform, deps: [di_1.Injector] },
    { provide: token_1.PLATFORM, useExisting: platform_3.Platform }
];
var createPlatform = (0, platform_1.createPlatformFactory)(null, _CORE_PLATFORM_PROVIDERS);
var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return createPlatform(platform_2.applicationContext, providers);
};
exports.dynamicPlatform = dynamicPlatform;
platform_2.applicationContext.registerStart(function () { return (0, exports.dynamicPlatform)().bootstrapRender(platform_2.applicationContext.providers); });
var platform_4 = require("@fm/core/providers/platform");
Object.defineProperty(exports, "PLATFORM_SCOPE", { enumerable: true, get: function () { return platform_4.PLATFORM_SCOPE; } });
var platform_5 = require("@fm/csr/providers/platform");
Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return platform_5.Application; } });
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return platform_5.Input; } });
Object.defineProperty(exports, "Prov", { enumerable: true, get: function () { return platform_5.Prov; } });
