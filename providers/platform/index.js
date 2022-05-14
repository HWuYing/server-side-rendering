import { Platform } from './platform';
export const dynamicPlatform = (providers = []) => new Platform(providers);
