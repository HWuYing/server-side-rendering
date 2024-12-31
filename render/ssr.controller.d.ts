import { Request, Response } from 'express';
import { RenderInterface } from '.';
import { Resource } from './resource';
export declare class UseSSRControl {
    protected renderVm: RenderInterface;
    constructor(resource: Resource);
    renderMicro(request: Request): Promise<{
        status: any;
        redirectUrl: any;
        html: any;
        styles: any;
        links: any;
        microTags: any;
        microFetchData: any;
    }>;
    render(request: Request, response: Response): Promise<void>;
}
