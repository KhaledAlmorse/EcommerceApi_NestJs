import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../base.service';
import {
  SubCategory,
  type SubCategoryType,
} from '../Models/sub-category.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadCloudFileService } from '../../Common/Services';

@Injectable()
export class SubCategoryRepository extends BaseService<SubCategoryType> {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategoryType>,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {
    super(subCategoryModel);
  }

  async deleteSubCategory(id: string) {
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }

    if (subCategory.image) {
      await this.uploadCloudFileService.DeleteFolderByPrefix(
        `${process.env.CLOUD_FOLDER_NAME}/Category/${subCategory.categoryId.toString()}/SubCategory/${subCategory.folderId}`,
      );
    }

    const deletedSubCategory =
      await this.subCategoryModel.findByIdAndDelete(id);
    return deletedSubCategory;
  }
}
