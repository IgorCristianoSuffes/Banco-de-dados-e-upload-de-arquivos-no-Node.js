import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import CategoriesRepository from '../repositories/CategoriesRepository';
import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getCustomRepository(CategoriesRepository);

  const categories: string[] = [];

  const allTransactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  const allCategories = await categoriesRepository.find();

  const transactions = await allTransactions.map(allTransactions => ({
    id: allTransactions.id,
    title: allTransactions.title,
    type: allTransactions.type,
    value: allTransactions.value,
    category_id: allTransactions.category_id,
    created_at: allTransactions.created_at,
    updated_at: allTransactions.updated_at,
    category: allCategories.find(
      categories => categories.id === allTransactions.category_id,
    ),
  }
  ));

  return response.status(200).json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);

});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({
    id
  });

  return response.status(204).json();

});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const updateCSV = new ImportTransactionsService();

  const transactions = await updateCSV.execute(request.file.path);

  return response.json(transactions);

});

export default transactionsRouter;
