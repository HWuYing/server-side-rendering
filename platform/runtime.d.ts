export { PLATFORM_SCOPE } from '@fm/core/platform';
export { ApplicationPlugin, createRegisterLoader, Input, Prov, Register, runtimeInjector } from '@fm/csr/platform/runtime';
export declare const Application: (metadata?: import("../../di").Type<import("../../core/platform/decorator").MetadataInfo> | {
    [key: string]: any;
}) => ClassDecorator;
