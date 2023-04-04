import { Render } from './render';
export { Resource } from './resource';
export var createSsrVm = function (options) { return new Render(options); };
