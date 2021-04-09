import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Category from './category.entity';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';
import CategoryNotFoundException from './exceptions/categoryNotFound.exception';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categorieRepository: Repository<Category>,
  ) {}

  getAllCategories = () => {
    return this.categorieRepository.find({ relations: ['posts'] });
  };

  getCategoriesById = async (id: number) => {
    const category = await this.categorieRepository.findOne(id, {
      relations: ['posts'],
    });

    if (category) {
      return category;
    }

    throw new CategoryNotFoundException(id);
  };

  async createCategory(category: CreateCategoryDto) {
    const newCategory = await this.categorieRepository.create(category);
    await this.categorieRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: UpdateCategoryDto) {
    await this.categorieRepository.update(id, category);
    const updatedCategory = await this.categorieRepository.findOne(id, {
      relations: ['posts'],
    });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new CategoryNotFoundException(id);
  }

  async deleteCategory(id: number) {
    const deleteResponse = await this.categorieRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }
}
