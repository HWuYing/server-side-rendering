import { __decorate } from "tslib";
import { Injectable } from '@fm/di';
import { JsonConfigService as ShareJsonConfigService } from '@fm/shared/providers/json-config';
let JsonConfigService = class JsonConfigService extends ShareJsonConfigService {
    getServerFetchData(url) {
        return this.appContext.readStaticFile(url);
    }
};
JsonConfigService = __decorate([
    Injectable()
], JsonConfigService);
export { JsonConfigService };
