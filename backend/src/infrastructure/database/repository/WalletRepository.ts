import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
import { IWalletRepository } from '../../../domain/interfaces/IWalletRepository';
import { WalletEntity } from '../../../domain/entities/wallet/WalletEntity';
import { WalletTransactionEntity } from '../../../domain/entities/wallet/WalletTransactionEntity';
import { WalletModel } from '../models/wallet/WalletModel';
import { WalletTransactionModel } from '../models/wallet/WalletTransactionModel';
import { WalletDoc, WalletLeanDoc } from '../schemas/wallet/WalletSchema';
import {
  WalletTransactionDoc,
  WalletTransactionLeanDoc,
} from '../schemas/wallet/WalletTransactionSchema';

@injectable()
export class WalletRepository implements IWalletRepository {
  async findByUserId(userId: string): Promise<WalletEntity | null> {
    const doc = await WalletModel.findOne({
      userId: new Types.ObjectId(userId),
    }).lean<WalletLeanDoc | null>();

    return doc
      ? { id: doc._id.toString(), userId: doc.userId.toString() }
      : null;
  }

  async createWallet(userId:string): Promise<WalletEntity> {
    const doc = await WalletModel.create({
      userId: new Types.ObjectId(userId),
    });

    return this.toWalletEntity(doc as WalletDoc);
  }

  async addTransaction(
    transaction: WalletTransactionEntity
  ): Promise<WalletTransactionEntity> {
    const doc = await WalletTransactionModel.create({
      walletId: new Types.ObjectId(transaction.walletId),
      type: transaction.type,
      amount: transaction.amount,
      reason: transaction.reason,
      referenceId: transaction.referenceId,
      createdAt: transaction.createdAt,
      affectsBalance: transaction.affectsBalance ?? true,
    });

    return this.toTransactionEntity(doc as WalletTransactionDoc);
  }

  async findTransactionsByWalletId(
    walletId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: WalletTransactionEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      WalletTransactionModel.find({ walletId: new Types.ObjectId(walletId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<WalletTransactionLeanDoc[]>(),
      WalletTransactionModel.countDocuments({ walletId: new Types.ObjectId(walletId) })
    ]);

    return {
      transactions: docs.map((d) => this.leanToTransactionEntity(d)),
      total,
    };
  }

  async getBalance(walletId: string): Promise<number> {
    const docs = await WalletTransactionModel.find({
      walletId: new Types.ObjectId(walletId),
      affectsBalance: true,
    }).lean<WalletTransactionLeanDoc[]>();

    let balance = 0;

    for (const t of docs) {
      if (t.type === 'CREDIT') balance += t.amount;
      else balance -= t.amount;
    }

    return balance;
  }

  private toWalletEntity(doc: WalletDoc): WalletEntity {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
    };
  }

  private toTransactionEntity(
    doc: WalletTransactionDoc
  ): WalletTransactionEntity {
    return {
      id: doc._id.toString(),
      walletId: doc.walletId.toString(),
      type: doc.type,
      amount: doc.amount,
      reason: doc.reason,
      referenceId: doc.referenceId,
      createdAt: doc.createdAt,
      affectsBalance: doc.affectsBalance,
    };
  }

  private leanToTransactionEntity(
    doc: WalletTransactionLeanDoc
  ): WalletTransactionEntity {
    return {
      id: doc._id.toString(),
      walletId: doc.walletId.toString(),
      type: doc.type,
      amount: doc.amount,
      reason: doc.reason,
      referenceId: doc.referenceId,
      createdAt: doc.createdAt,
      affectsBalance: doc.affectsBalance,
    };
  }
}
