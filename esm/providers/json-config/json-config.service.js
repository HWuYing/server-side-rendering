import { __decorate, __metadata } from "tslib";
import { JsonConfigService as ShareJsonConfigService } from '@hwy-fm/core';
import { Inject, Injectable } from '@hwy-fm/di';
import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import { AppContextService } from '../app-context';
let JsonConfigService = class JsonConfigService extends ShareJsonConfigService {
    getJsonConfig(url) {
        return of(cloneDeep(this.appContext.readStaticFile(url)));
    }
};
__decorate([
    Inject(AppContextService),
    __metadata("design:type", AppContextService)
], JsonConfigService.prototype, "appContext", void 0);
JsonConfigService = __decorate([
    Injectable()
], JsonConfigService);
export { JsonConfigService };
