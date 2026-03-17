"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_entity_1 = require("./users/entities/user.entity");
const pack_entity_1 = require("./packs/entities/pack.entity");
const pack_option_entity_1 = require("./packs/entities/pack-option.entity");
const reservation_entity_1 = require("./reservations/entities/reservation.entity");
const users_module_1 = require("./users/users.module");
const packs_module_1 = require("./packs/packs.module");
const reservations_module_1 = require("./reservations/reservations.module");
const auth_module_1 = require("./auth/auth.module");
const mail_module_1 = require("./mail/mail.module");
const current_user_middleware_1 = require("./common/middleware/current-user.middleware");
const jwt_1 = require("@nestjs/jwt");
const logs_module_1 = require("./logs/logs.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(current_user_middleware_1.CurrentUserMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [user_entity_1.User, pack_entity_1.Pack, pack_option_entity_1.PackOption, reservation_entity_1.Reservation],
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'secret',
                }),
            }),
            users_module_1.UsersModule,
            packs_module_1.PacksModule,
            reservations_module_1.ReservationsModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            logs_module_1.LogsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map