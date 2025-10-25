import { container } from "tsyringe";
import { ICacheService } from "../../application/ports/cache/ICacheService";
import { CacheService } from "../../infrastructure/adapters/cache/CacheService";
import { IEmailService } from "../../application/ports/mail/IEmailService";
import { MailService } from "../../infrastructure/adapters/mail/MailService";
import { TemplateFactoryImpl } from "../../infrastructure/adapters/mail/template/TemplateFactory";
import { IEmailTemplateFactory } from "../../application/ports/mail/template/IEmailTemplateFactory";
import { IJWTService } from "../../application/ports/security/IJWTService";
import { JWTService } from "../../infrastructure/adapters/security/JWTService";

export class ServiceModule {
    static registerModules():void {
        container.register<ICacheService>('ICacheService', {
            useClass:CacheService,
        });

        container.register<IEmailService>('IEmailService',{
            useClass:MailService,
        });

        container.register<IEmailTemplateFactory>('IEmailTemplateFactory', {
            useClass:TemplateFactoryImpl
        });

        container.register<IJWTService>('IJWTService', {
            useClass:JWTService,
        });
    };
};