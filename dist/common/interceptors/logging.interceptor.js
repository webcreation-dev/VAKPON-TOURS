"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const logs_service_1 = require("../../logs/logs.service");
let LoggingInterceptor = class LoggingInterceptor {
    logsService;
    logger = new common_1.Logger('HTTP_ACTION');
    constructor(logsService) {
        this.logsService = logsService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { user, method, url, ip, body } = request;
        if (user) {
            const now = Date.now();
            return next.handle().pipe((0, operators_1.tap)(async () => {
                const delay = Date.now() - now;
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;
                this.logger.log(`User: ${user.email} (ID: ${user.id}) | Method: ${method} | URL: ${url} | Status: ${statusCode} | Duration: ${delay}ms`);
                try {
                    await this.logsService.create({
                        method,
                        url,
                        ip,
                        duration: delay,
                        statusCode,
                        user,
                        userEmail: user.email,
                        payload: method !== 'GET' ? body : null,
                    });
                }
                catch (error) {
                    this.logger.error('Failed to save log to database', error);
                }
            }));
        }
        return next.handle();
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logs_service_1.LogsService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map