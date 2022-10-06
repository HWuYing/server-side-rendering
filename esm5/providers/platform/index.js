import { Platform } from './platform';
export var dynamicPlatform = function (providers) {
    if (providers === void 0) { providers = []; }
    return new Platform(providers);
};
