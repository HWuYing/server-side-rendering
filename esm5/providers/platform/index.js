import { Injector } from '@fm/di';
import { createPlafformFactory } from '@fm/shared/providers/platform';
import { PLATFORM } from '@fm/shared/token';
import { Platform } from './platform';
var _CORE_PLATFORM_PROVIDERS = [
    { provide: Platform, deps: [Injector] },
    { provide: PLATFORM, useExisting: Platform }
];
var createPlatform = createPlafformFactory(null, _CORE_PLATFORM_PROVIDERS);
export var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return createPlatform(providers);
};
