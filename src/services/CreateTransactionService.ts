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

    const categoryName = category;

    const findCategoryInDataBase = await categoriesRepository.findByCategoryExist(categoryName);

    if (!findCategoryInDataBase) {

      
    
    }
    
  }
}

export default CreateTransactionService;
