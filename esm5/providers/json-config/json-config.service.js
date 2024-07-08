import { __decorate, __extends, __metadata } from "tslib";
import { JsonConfigService as ShareJsonConfigService } from '@hwy-fm/core';
import { Inject, Injectable } from '@hwy-fm/di';
import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import { AppContextService } from '../app-context';
var JsonConfigService = /** @class */ (function (_super) {
    __extends(JsonConfigService, _super);
    function JsonConfigService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonConfigService.prototype.getJsonConfig = function (url) {
        return of(cloneDeep(this.appContext.readStaticFile(url)));
    };
    __decorate([
        Inject(AppContextService),
        __metadata("design:type", AppContextService)
    ], JsonConfigService.prototype, "appContext", void 0);
    JsonConfigService = __decorate([
        Injectable()
    ], JsonConfigService);
    return JsonConfigService;
}(ShareJsonConfigService));
export { JsonConfigService };
