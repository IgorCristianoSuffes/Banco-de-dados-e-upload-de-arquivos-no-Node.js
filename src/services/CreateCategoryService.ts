import { getCustomRepository } from 'typeorm';
import CategoryModels from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
    category: string;
}

class CreateCategoryService {
    public async execute({ category }: Request): Promise<CategoryModels> {
        const categoriesRepository = getCustomRepository(CategoriesRepository);

        const title = category;

        const categoryCreate = categoriesRepository.create({
            title,
        });

        await categoriesRepository.save(categoryCreate);
        return categoryCreate;
    }
}

export default CreateCategoryService;