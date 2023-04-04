import { Render } from './render';
export { Resource } from './resource';
export const createSsrVm = (options) => new Render(options);
