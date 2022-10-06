"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicPlatform = void 0;
var platform_1 = require("./platform");
var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return new platform_1.Platform(providers);
};
exports.dynamicPlatform = dynamicPlatform;
