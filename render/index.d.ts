import { Render } from './render';
import { ResourceOptions } from './type-api';
export { Resource } from './resource';
export type { Fetch, RenderInterface, ResourceOptions } from './type-api';
export declare const createSsrVm: (options: ResourceOptions) => Render;
