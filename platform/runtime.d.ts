import { Provider } from '@fm/di';
import { Platform } from './index';
export declare const dynamicPlatform: (providers?: Provider[]) => Platform;
export { PLATFORM_SCOPE } from '@fm/core/platform/application';
export { Application, Input, Prov } from '@fm/csr/platform/runtime';
