import { __decorate, __extends } from "tslib";
import { Injectable } from '@fm/di';
import { JsonConfigService as ShareJsonConfigService } from '@fm/shared/providers/json-config';
var JsonConfigService = /** @class */ (function (_super) {
    __extends(JsonConfigService, _super);
    function JsonConfigService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonConfigService.prototype.getServerFetchData = function (url) {
        return this.appContext.readStaticFile(url);
    };
    JsonConfigService = __decorate([
        Injectable()
    ], JsonConfigService);
    return JsonConfigService;
}(ShareJsonConfigService));
export { JsonConfigService };
