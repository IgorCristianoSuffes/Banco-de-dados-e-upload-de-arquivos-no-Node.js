import { getCustomRepository, TransactionRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import AppError from '../errors/AppError';
import CreateCategoryService from '../services/CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === "outcome" && total < value) {
      throw new AppError("You do not have enough balance");
    }

    const createCategory = new CreateCategoryService();

    const categoryName = category;

    const findCategoryInDataBase = await categoriesRepository.findByCategoryExist(categoryName);

    if (!findCategoryInDataBase) {

      const createCategoryInDatabase = await createCategory.execute({
        category,
      });

      const transaction = await transactionsRepository.create({
        title,
        value,
        type,
        category_id: createCategoryInDatabase.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;

    } else {

      const transaction = await transactionsRepository.create({
        title,
        value,
        type,
        category_id: findCategoryInDataBase.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }
    
  }
}

export default CreateTransactionService;
