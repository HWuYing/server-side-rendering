import { ApplicationContext, createPlafformFactory } from '@fm/core/providers/platform';
import { PLATFORM } from '@fm/core/token';
import { Injector } from '@fm/di';
import { Platform } from './platform';
var applicationContext = new ApplicationContext();
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
export var Application = applicationContext.makeApplicationDecorator();
export var Prov = applicationContext.makeProvDecorator('MethodDecorator');
