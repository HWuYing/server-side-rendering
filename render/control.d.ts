import { Request, Response } from 'express';
import { SSROptions } from "./type-api";
export declare abstract class SSRControl {
    private ssrVm;
    constructor(entryFile: string, options: SSROptions);
    renderMicro(request: Request, response: Response): Promise<void>;
    render(request: Request, response: Response): Promise<void>;
}
