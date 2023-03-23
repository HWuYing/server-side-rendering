import { Provider } from '@fm/di';
import { Platform } from './platform';
export declare const dynamicPlatform: (providers?: Provider[]) => Platform;
export { PLATFORM_SCOPE } from '@fm/core/providers/platform';
export { Application, Input, Prov } from '@fm/csr/providers/platform';
