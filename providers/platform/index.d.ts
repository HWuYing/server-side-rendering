import { Provider } from '@fm/di';
import { Platform } from './platform';
export declare const dynamicPlatform: (providers?: Provider[]) => Platform;
export { PLATFORM_SCOPE } from '@fm/core/providers/platform';
export declare const Application: (this: unknown, ...args: any[]) => (cls: import("@fm/di").Type<any>) => any;
export declare const Prov: (this: unknown, ...args: any[]) => any;
