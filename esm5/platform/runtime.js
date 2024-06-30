import { createPlatformFactory } from '@fm/core/platform';
import { makeApplication } from '@fm/core/platform/decorator';
import { PLATFORM } from '@fm/core/token';
import { Platform } from './index';
export { PLATFORM_SCOPE } from '@fm/core/platform';
export { ApplicationPlugin, createRegisterLoader, Input, Prov, Register, runtimeInjector } from '@fm/csr/platform/runtime';
export var Application = makeApplication(function (applicationContext) {
    var createPlatform = createPlatformFactory(null, [{ provide: PLATFORM, useClass: Platform }]);
    createPlatform(applicationContext).bootstrapRender(applicationContext.providers);
});
