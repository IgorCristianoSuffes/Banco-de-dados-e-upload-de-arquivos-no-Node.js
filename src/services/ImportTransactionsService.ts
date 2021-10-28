import Transaction from '../models/Transaction';
import csvParse from 'csv-parse';
import fs from 'fs';
import CreateTransactionService from '../services/CreateTransactionService';

interface Request {
  csvFilename: string;
}

class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<void> { //Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const readCSVStream = fs.createReadStream(csvFilename);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines = [];

    parseCSV.on('data', line => {
      lines.push(line);

      createTransaction.execute({
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

  }
}

export default ImportTransactionsService;
