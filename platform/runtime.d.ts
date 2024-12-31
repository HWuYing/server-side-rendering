export { PLATFORM_SCOPE } from '@hwy-fm/core/platform';
export { ApplicationPlugin, createRegisterLoader, Input, Prov, Register, runtimeInjector } from '@hwy-fm/csr/platform/runtime';
export declare const Application: (metadata?: import("../../di").Type<import("@hwy-fm/core/platform/decorator").MetadataInfo> | {
    [key: string]: any;
}) => import("../../di/decorators").ClassDecorator<any>;
