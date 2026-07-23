import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoryRepository, CategoryRepository } from 'src/DB/Repositories';
import { IAuthUser } from 'src/Common/Types';
import slugify from 'slugify';
import { UploadCloudFileService } from 'src/Common/Services';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {}

  async createSubCategory(
    body: CreateSubCategoryDto,
    user: IAuthUser,
    image?: Express.Multer.File,
  ) {
    const categoryExist = await this.categoryRepository.findOne({
      filters: { _id: body.categoryId },
    });

    if (!categoryExist) {
      throw new NotFoundException('Category not found');
    }

    const isExist = await this.subCategoryRepository.findOne({
      filters: { name: body.name },
    });

    if (isExist) {
      throw new BadRequestException('SubCategory already exists');
    }

    const folderId = Math.random().toString(36).slice(2, 10);
    const subCategoryData: any = {
      ...body,
      addedBy: user.user._id,
      folderId,
    };

    if (image) {
      const uploadedImage = await this.uploadCloudFileService.uploadFile(
        image.path,
        {
          folder: `${process.env.CLOUD_FOLDER_NAME}/Category/${categoryExist.folderId}/SubCategory/${folderId}`,
        },
      );

      subCategoryData.image = {
        secure_url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    const subCategory =
      await this.subCategoryRepository.create(subCategoryData);

    if (!subCategory) {
      throw new BadRequestException('SubCategory not created');
    }

    return subCategory;
  }

  async findAllSubCategory() {
    const subCategories = await this.subCategoryRepository.findMany({
      populationArray: [
        { path: 'categoryId', select: 'name' },
        { path: 'addedBy', select: 'firstName lastName email' },
      ],
    });

    if (!subCategories) throw new BadRequestException('SubCategory not found');

    return subCategories;
  }

  async findOneSubCategory(id: string) {
    const subCategory = await this.subCategoryRepository.findOne({
      filters: { _id: id },
      populationArray: [
        { path: 'categoryId', select: 'name' },
        { path: 'addedBy', select: 'firstName lastName email' },
      ],
    });
    if (!subCategory) throw new BadRequestException('SubCategory not found');
    return subCategory;
  }

  async updateSubCategory(
    id: string,
    body: UpdateSubCategoryDto,
    user: IAuthUser,
    image?: Express.Multer.File,
  ) {
    const isExist = await this.subCategoryRepository.findOne({
      filters: { _id: id },
    });
    if (!isExist) throw new NotFoundException('SubCategory not found');

    if (body.name) {
      const isUniqueSubCategory = await this.subCategoryRepository.findOne({
        filters: {
          name: body.name,
        },
      });
      if (isUniqueSubCategory && isUniqueSubCategory._id.toString() !== id) {
        throw new BadRequestException('SubCategory already exists');
      }
    }

    let categoryFolderId = '';
    if (body.categoryId) {
      const categoryExist = await this.categoryRepository.findOne({
        filters: { _id: body.categoryId },
      });
      if (!categoryExist) {
        throw new NotFoundException('Category not found');
      }
      categoryFolderId = categoryExist.folderId;
    } else {
      const categoryExist = await this.categoryRepository.findOne({
        filters: { _id: isExist.categoryId },
      });
      if (categoryExist) {
        categoryFolderId = categoryExist.folderId;
      }
    }

    const subCategoryData: any = {
      ...body,
      updatedBy: user.user._id,
    };

    if (body.name) {
      subCategoryData.slug = slugify(body.name || '', {
        lower: true,
        trim: true,
      });
    }

    if (image) {
      // delete old image if exist
      if (isExist.image && isExist.image['public_id']) {
        await this.uploadCloudFileService.DeleteFileByPublicId(
          isExist.image['public_id'],
        );
      }

      const uploadedImage = await this.uploadCloudFileService.uploadFile(
        image.path,
        {
          folder: `${process.env.CLOUD_FOLDER_NAME}/Category/${categoryFolderId}/SubCategory/${isExist.folderId}`,
        },
      );

      subCategoryData.image = {
        secure_url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    const subCategory = await this.subCategoryRepository.update({
      filters: { _id: id },
      body: subCategoryData,
    });
    if (!subCategory) throw new BadRequestException('SubCategory not updated');
    return subCategory;
  }

  async removeSubCategory(id: string) {
    const subCategory = await this.subCategoryRepository.deleteSubCategory(id);
    if (!subCategory) throw new BadRequestException('SubCategory not deleted');
    return subCategory;
  }
}
