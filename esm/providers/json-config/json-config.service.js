import { __decorate } from "tslib";
import { JsonConfigService as ShareJsonConfigService } from '@fm/core';
import { Injectable } from '@fm/di';
import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import { AppContextService } from '../app-context';
let JsonConfigService = class JsonConfigService extends ShareJsonConfigService {
    getJsonConfig(url) {
        return of(cloneDeep(this.injector.get(AppContextService).readStaticFile(url)));
    }
};
JsonConfigService = __decorate([
    Injectable()
], JsonConfigService);
export { JsonConfigService };
