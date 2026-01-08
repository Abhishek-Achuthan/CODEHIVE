import { container } from 'tsyringe';
import { ICacheService } from '../../application/ports/cache/ICacheService';
import { CacheService } from '../../infrastructure/adapters/cache/CacheService';
import { IEmailService } from '../../application/ports/mail/IEmailService';
import { MailService } from '../../infrastructure/adapters/mail/MailService';
import { TemplateFactoryImpl } from '../../infrastructure/adapters/mail/template/TemplateFactory';
import { IEmailTemplateFactory } from '../../application/ports/mail/template/IEmailTemplateFactory';
import { IJWTService } from '../../application/ports/security/IJWTService';
import { JWTService } from '../../infrastructure/adapters/security/JWTService';
import { IHashService } from '../../application/ports/security/IHashService';
import { HashService } from '../../infrastructure/adapters/security/HashService';
import { IOTPService } from '../../application/ports/otp/IOTPService';
import { OTPService } from '../../infrastructure/adapters/otp/OTPService';
import { ITokenBlacklistService } from '../../application/ports/security/ITokenBlacklistService';
import { TokenBlacklistService } from '../../infrastructure/adapters/security/TokenBlacklistService';
import { IGoogleAuthService } from '../../application/ports/security/IGoogleAuthService';
import { GoogleAuthService } from '../../infrastructure/adapters/security/GoogleAuthService';
import { IGithubAuthService } from '../../application/ports/security/IGithubAuthService';
import { GitHubAuthService } from '../../infrastructure/adapters/security/GithubAuthService';
import { IAIService } from '../../application/ports/ai/IAIService';
import { AIService } from '../../infrastructure/adapters/ai/AIService';
import { IRRuleSlotService } from '../../application/ports/slot/IRRuleSlotService';
import { RRuleSlotService } from '../../infrastructure/adapters/session/RRuleSlotService';
import { ISlotConflictService } from '../../application/ports/slot/ISlotConflictService';
import { SlotConflictService } from '../../infrastructure/adapters/session/SlotConflictService';

export class ServiceModule {
  static registerModules(): void {
    container.register<ICacheService>('ICacheService', {
      useClass: CacheService,
    });

    container.register<IEmailService>('IEmailService', {
      useClass: MailService,
    });

    container.register<IEmailTemplateFactory>('IEmailTemplateFactory', {
      useClass: TemplateFactoryImpl,
    });

    container.register<IJWTService>('IJWTService', {
      useClass: JWTService,
    });

    container.register<IHashService>('IHashService', {
      useClass: HashService,
    });

    container.register<IOTPService>('IOTPService', {
      useClass: OTPService,
    });

    container.register<ITokenBlacklistService>('ITokenBlacklistService', {
      useClass: TokenBlacklistService,
    });

    container.register<IGoogleAuthService>('IGoogleAuthService' , {
      useClass: GoogleAuthService,
    })

    container.register<IGithubAuthService>('IGithubAuthService', {
      useClass: GitHubAuthService,
    });

    container.register<IAIService>('IAIService', {
      useClass : AIService
    })

    container.register<IRRuleSlotService>('IRRuleSlotService',{
      useClass: RRuleSlotService
    });

    container.register<ISlotConflictService>('ISlotConflictService',{
      useClass: SlotConflictService
    })
  }
}
