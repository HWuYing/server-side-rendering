"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicPlatform = void 0;
var tslib_1 = require("tslib");
// export { AppContextService } from './providers/app-context';
// export { JsonConfigService } from './providers/json-config';
var platform_1 = require("./providers/platform");
Object.defineProperty(exports, "dynamicPlatform", { enumerable: true, get: function () { return platform_1.dynamicPlatform; } });
tslib_1.__exportStar(require("@fm/core"), exports);
