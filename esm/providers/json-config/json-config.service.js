import { __decorate } from "tslib";
import { Injectable } from '@fm/di';
import { JsonConfigService as ShareJsonConfigService } from '@fm/shared/providers/json-config';
import { AppContextService } from '../app-context';
let JsonConfigService = class JsonConfigService extends ShareJsonConfigService {
    getJsonConfig(url) {
        return this.injector.get(AppContextService).readStaticFile(url);
    }
};
JsonConfigService = __decorate([
    Injectable()
], JsonConfigService);
export { JsonConfigService };
