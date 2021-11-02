import Transaction from '../models/Transaction';
import csvParse from 'csv-parse';
import fs from 'fs';
import CreateTransactionService from '../services/CreateTransactionService';
import path from 'path';
import uploadConfig from '../config/upload';
import { request } from 'express';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { getCustomRepository, In } from 'typeorm';
import Category from '../models/Category';

interface Request {
  csvFilename: string;
}

interface CSVTramsaction {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class ImportTransactionsService {
  public async execute({ csvFilename }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const CSVFilePath = path.join(uploadConfig.directory, csvFilename);

    const readCSVStream = await fs.createReadStream(CSVFilePath);

    const parseStream = csvParse({
      from_line: 2
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactions: CSVTramsaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {

      const [title, type, value, category] = line.map((cell:string) => cell.trim());

      /*createTransaction.execute({
        title: title,
        type: type,
        value: value,
        category: category,
      });*/

      categories.push(category);

      transactions.push({ title, type, value, category });

    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
    .filter(category => !existentCategoriesTitles.includes(category))
    .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories ];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => (
        {
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalCategories.find(
            category => category.title === transaction.category,
          ),
        }
      ))
    );

    await transactionsRepository.save(createdTransactions);

    await fs.promises.unlink(CSVFilePath);

    return createdTransactions;

  }
}

export default ImportTransactionsService;
