import { JsonConfigService as ShareJsonConfigService } from '@fm/shared/providers/json-config';
import { AppContextService } from '../app-context';
export declare class JsonConfigService extends ShareJsonConfigService {
    protected appContext: AppContextService;
    protected getServerFetchData(url: string): import("rxjs/internal/Observable").Observable<any>;
}
