import { Render } from './render';
import { Resource } from './resource';
export { Resource, SSR_FETCH, SSR_STATIC_FOLDER } from './resource';
export { UseSSRControl } from './ssr.controller';
export type { Fetch, RenderInterface } from './type-api';
export declare const createSsrVm: (resource: Resource) => Render;
