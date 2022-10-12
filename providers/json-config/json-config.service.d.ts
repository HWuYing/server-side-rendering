import { JsonConfigService as ShareJsonConfigService } from '@fm/shared';
import { Observable } from 'rxjs';
export declare class JsonConfigService extends ShareJsonConfigService {
    getJsonConfig(url: string): Observable<object>;
}
