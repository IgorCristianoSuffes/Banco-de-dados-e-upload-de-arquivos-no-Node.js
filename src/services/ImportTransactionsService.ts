import Transaction from '../models/Transaction';
import csvParse from 'csv-parse';
import fs from 'fs';
import CreateTransactionService from '../services/CreateTransactionService';

interface Request {
  csvFilename: string;
}

interface DTOTransaction {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<void>{  //Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const readCSVStream = await fs.createReadStream(csvFilename);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    let lines = [];



    parseCSV.on('data', line => {
      console.log(lines.push(line));
      
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
