import { createPlatformFactory } from '@fm/core/platform';
import { PLATFORM } from '@fm/core/token';
import { applicationContext } from '@fm/csr/platform/runtime';
import { Injector } from '@fm/di';
import { Platform } from './index';
var _CORE_PLATFORM_PROVIDERS = [
    { provide: Platform, deps: [Injector] },
    { provide: PLATFORM, useExisting: Platform }
];
var createPlatform = createPlatformFactory(null, _CORE_PLATFORM_PROVIDERS);
export var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return createPlatform(applicationContext, providers);
};
applicationContext.registerStart(function () { return dynamicPlatform().bootstrapRender(applicationContext.providers); });
export { PLATFORM_SCOPE } from '@fm/core/platform/application';
export { Application, Input, Prov } from '@fm/csr/platform/runtime';
