import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Category, type CategoryType } from '../Models/category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductType } from '../Models';
import { ProductRepository } from './product.repository';
import { SubCategory, SubCategoryType } from '../Models/sub-category.model';
import { Brand, BrandType } from '../Models/brand.model';
import { UploadCloudFileService } from '../../Common/Services';

@Injectable()
export class CategoryRepository extends BaseService<CategoryType> {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryType>,
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategoryType>,
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandType>,
    private readonly productRepository: ProductRepository,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {
    super(categoryModel);
  }

  async deleteCategory(id: string) {
    //* first delete all related product, subcategories, brands, and then delete the category
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.productRepository.deleteMany({
      filters: { categoryId: new Types.ObjectId(id) },
    });

    await this.subCategoryModel.deleteMany({
      categoryId: new Types.ObjectId(id),
    });

    await this.brandModel.deleteMany({
      categoryId: new Types.ObjectId(id),
    });

    // Delete the whole Category folder from Cloudinary (which contains category, subcategory, brand, and product images)
    await this.uploadCloudFileService.DeleteFolderByPrefix(
      `${process.env.CLOUD_FOLDER_NAME}/Category/${category.folderId}`,
    );

    const deletedCategory = await this.categoryModel.findByIdAndDelete(id);

    return deletedCategory;
  }
}
