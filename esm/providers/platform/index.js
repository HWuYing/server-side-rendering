import { ApplicationContext, createPlafformFactory } from '@fm/core/providers/platform';
import { PLATFORM } from '@fm/core/token';
import { Injector } from '@fm/di';
import { Platform } from './platform';
const applicationContext = new ApplicationContext();
const _CORE_PLATFORM_PROVIDERS = [
    { provide: Platform, deps: [Injector] },
    { provide: PLATFORM, useExisting: Platform },
    { provide: ApplicationContext, useFactory: () => applicationContext }
];
const createPlatform = createPlafformFactory(null, _CORE_PLATFORM_PROVIDERS);
export const dynamicPlatform = (providers = []) => createPlatform(applicationContext, providers);
applicationContext.regeditStart(() => dynamicPlatform().bootstrapRender(applicationContext.providers));
export { PLATFORM_SCOPE } from '@fm/core/providers/platform';
export const Application = applicationContext.makeApplicationDecorator();
export const Prov = applicationContext.makeProvDecorator('MethodDecorator');
