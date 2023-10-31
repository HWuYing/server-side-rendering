import { createPlatformFactory } from '@fm/core/platform';
import { PLATFORM } from '@fm/core/token';
import { applicationContext } from '@fm/csr/platform/runtime';
import { Injector } from '@fm/di';
import { Platform } from './index';
const _CORE_PLATFORM_PROVIDERS = [
    { provide: Platform, deps: [Injector] },
    { provide: PLATFORM, useExisting: Platform }
];
const createPlatform = createPlatformFactory(null, _CORE_PLATFORM_PROVIDERS);
export const dynamicPlatform = (providers = []) => createPlatform(applicationContext, providers);
applicationContext.registerStart(() => dynamicPlatform().bootstrapRender(applicationContext.providers));
export { PLATFORM_SCOPE } from '@fm/core/platform/application';
export { Application, ApplicationPlugin, Input, Prov } from '@fm/csr/platform/runtime';
