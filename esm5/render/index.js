import { Render } from './render';
export { Resource, SSR_FETCH, SSR_STATIC_FOLDER } from './resource';
export { UseSSRControl } from './ssr.controller';
export var createSsrVm = function (resource) { return new Render(resource); };
