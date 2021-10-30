import Transaction from '../models/Transaction';
import csvParse from 'csv-parse';
import fs from 'fs';
import CreateTransactionService from '../services/CreateTransactionService';
import path from 'path';
import uploadConfig from '../config/upload';

interface Request {
  csvFilename: string;
}

interface DTOTransaction {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
  id: string;
  created_at: Date;
  updated_at: Date;
}

class ImportTransactionsService {
  public async execute({ csvFilename }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const CSVFilePath = path.join(uploadConfig.directory, csvFilename);

    const readCSVStream = await fs.createReadStream(CSVFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    let lines: Transaction[] = [];

    let transactionImportCSV: Transaction[] = [];

    parseCSV.on('data', line => {
      lines.push(line);
      //console.log( line[0]);
      //console.log( line[1]);
      //console.log( line[2]);
      //console.log( line[3]);
      createTransaction.execute({
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      });

      //transactionImportCSV.push(line[0]);

    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    console.log(lines);

    return lines;

  }
}

export default ImportTransactionsService;
