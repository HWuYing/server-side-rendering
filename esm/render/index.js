import { Render } from './render';
export { Resource, SSR_FETCH, SSR_STATIC_FOLDER } from './resource';
export { UseSSRControl } from './ssr.controller';
export const createSsrVm = (resource) => new Render(resource);
