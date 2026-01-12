import { inject, injectable } from 'tsyringe';
import { ICancelSessionUseCase } from '../interface/session/ICancelSessionUseCase';
import { NotFoundError } from '../../../core/errors/NotFoundError';
import { BadRequestError } from '../../../core/errors/BadRequestError';
import { type ISessionRepository } from '../../../domain/interfaces/ISessionReposiotry';
import { type IWalletService } from '../../ports/wallet/IWalletService';
import { type IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import { Credit } from '../../../domain/types/WalletTransactionInput';
import { WalletTransactionReason } from '../../../domain/types/WalletTransactionReason';
import { ERROR_MESSAGES } from '../../../shared/constants/errorMessages';
import { SessionStatus } from '../../../domain/types/SessionStatus';

@injectable()
export class CancelSessionUseCase implements ICancelSessionUseCase {
  constructor(
    @inject('ISessionRepository')
    private readonly _sessionRepository: ISessionRepository,
    @inject('IWalletService') 
    private readonly _walletService : IWalletService,
    @inject('IWalletRepository') 
    private readonly _walletRepository : IWalletRepository

  ) {}

  async execute(sessionId: string,userId:string): Promise<boolean> {
    const session = await this._sessionRepository.find(sessionId);

    if (!session || !session.startTime)
      throw new NotFoundError(ERROR_MESSAGES.SESSION.SESSION_NOT_FOUND);

    if(session.userId !== userId) 
      throw new BadRequestError(ERROR_MESSAGES.SESSION.NOT_ALLOWED_TO_CANCEL);

    const now: number = Date.now();
    const twentyFourHoursInMs: number = 24 * 60 * 60 * 1000;

    const startTimeMs = session.startTime.getTime();

    if (startTimeMs <= now) {
      throw new BadRequestError(ERROR_MESSAGES.SESSION.ALREADY_STARTED);
    }

    const isRefundable = startTimeMs - now > twentyFourHoursInMs;

    if(session.status === SessionStatus.CANCELLED || session.refunded ===true) 
      throw new BadRequestError(ERROR_MESSAGES.SESSION.ALREADY_CANCELLED); 


    let refunded = false;

    if(isRefundable) {

      const wallet = await this._walletRepository.findByUserId(userId);

      if(!wallet) throw new BadRequestError(ERROR_MESSAGES.WALLET.NOT_FOUND);


      const transaction : Credit = {
        walletId : wallet.id,
        amount : session.amountPaid,
        reason : WalletTransactionReason.SESSION_REFUND,
        referenceId:sessionId
      }

      await this._walletService.credit(transaction);

      refunded = true;
    } 

    await this._sessionRepository.update(sessionId,{status:SessionStatus.CANCELLED,refunded});
    return true;
  }
}
