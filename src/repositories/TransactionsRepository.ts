import { Any, EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(): Promise<Balance> {

    const transactions = await this.find();

    const { income, outcome } = transactions.reduce((accumulator: Balance, transaction: Transaction) => {
      switch ( transaction.type ) {
        case "income":
          accumulator.income += transaction.value;
          break;
        case "outcome":
          accumulator.outcome += transaction.value;
          break;
        default:
          break;
      }
      return accumulator;
    }, {
      income: 0,
      outcome: 0,
      total: 0
    });

    const total = income-outcome;


    return { income, outcome, total};
  }

  public async findByTransactionExist(id: string): Promise<Transaction | null> {

    const findTransaction = await this.findOne({
        where: { id },
    });

    return findTransaction || null;
  }

}

export default TransactionsRepository;
