import { createPlatformFactory } from '@hwy-fm/core/platform';
import { makeApplication } from '@hwy-fm/core/platform/decorator';
import { PLATFORM } from '@hwy-fm/core/token';
import { Platform } from './index';
export { PLATFORM_SCOPE } from '@hwy-fm/core/platform';
export { ApplicationPlugin, createRegisterLoader, Input, Prov, Register, runtimeInjector } from '@hwy-fm/csr/platform/runtime';
export const Application = makeApplication((applicationContext) => {
    const createPlatform = createPlatformFactory(null, [{ provide: PLATFORM, useClass: Platform }]);
    createPlatform(applicationContext).bootstrapRender(applicationContext.providers);
});
