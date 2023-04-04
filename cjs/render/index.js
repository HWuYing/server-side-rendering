"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSsrVm = exports.Resource = void 0;
var render_1 = require("./render");
var resource_1 = require("./resource");
Object.defineProperty(exports, "Resource", { enumerable: true, get: function () { return resource_1.Resource; } });
var createSsrVm = function (options) { return new render_1.Render(options); };
exports.createSsrVm = createSsrVm;
