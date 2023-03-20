import { JsonConfigService as ShareJsonConfigService } from '@fm/core';
import { Observable } from 'rxjs';
export declare class JsonConfigService extends ShareJsonConfigService {
    getJsonConfig(url: string): Observable<object>;
}
