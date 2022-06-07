"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureFuncContext = void 0;
const common_1 = require("@nestjs/common");
exports.AzureFuncContext = (0, common_1.createParamDecorator)((_data, ctx) => {
    return ctx.switchToHttp().getRequest().context;
})();
