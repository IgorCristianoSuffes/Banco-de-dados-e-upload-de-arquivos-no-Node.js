//import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string,
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const findTransactionInDatabase = await transactionsRepository.findByTransactionExist(
      id,
    );

    if (!findTransactionInDatabase) {
      console.log("aqui ó");
      throw new AppError('This transaction not find');
    }

    await transactionsRepository.delete(id);

    return;

  }
}

export default DeleteTransactionService;
