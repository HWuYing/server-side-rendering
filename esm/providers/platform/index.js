import { Injector } from '@fm/di';
import { createPlafformFactory } from '@fm/shared/providers/platform';
import { PLATFORM } from '@fm/shared/token';
import { Platform } from './platform';
const _CORE_PLATFORM_PROVIDERS = [
    { provide: Platform, deps: [Injector] },
    { provide: PLATFORM, useExisting: Platform }
];
const createPlatform = createPlafformFactory(null, _CORE_PLATFORM_PROVIDERS);
export const dynamicPlatform = (providers = []) => createPlatform(providers);
