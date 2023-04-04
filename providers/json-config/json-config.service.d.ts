import { JsonConfigService as ShareJsonConfigService } from '@fm/core';
import { Observable } from 'rxjs';
import { AppContextService } from '../app-context';
export declare class JsonConfigService extends ShareJsonConfigService {
    appContext: AppContextService;
    getJsonConfig(url: string): Observable<object>;
}
