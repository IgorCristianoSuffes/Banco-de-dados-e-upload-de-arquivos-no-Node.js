import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface CategoryFind {
    id: string;
    title: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {

  public async findByCategoryExist(title: string): Promise<CategoryFind | null> {
    const findCategory = await this.findOne({
        where: { title },
    });

    console.log(findCategory);

    return findCategory || null;
  }
}

export default CategoriesRepository;
