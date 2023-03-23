import { ApplicationContext, createPlafformFactory } from '@fm/core/providers/platform';
import { PLATFORM } from '@fm/core/token';
import { applicationContext } from '@fm/csr/providers/platform';
import { Injector } from '@fm/di';
import { Platform } from './platform';
var _CORE_PLATFORM_PROVIDERS = [
    { provide: Platform, deps: [Injector] },
    { provide: PLATFORM, useExisting: Platform },
    { provide: ApplicationContext, useFactory: function () { return applicationContext; } }
];
var createPlatform = createPlafformFactory(null, _CORE_PLATFORM_PROVIDERS);
export var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return createPlatform(applicationContext, providers);
};
applicationContext.regeditStart(function () { return dynamicPlatform().bootstrapRender(applicationContext.providers); });
export { PLATFORM_SCOPE } from '@fm/core/providers/platform';
export { Application, Input, Prov } from '@fm/csr/providers/platform';
