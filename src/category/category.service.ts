import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from 'src/DB/Repositories';
import { IAuthUser } from 'src/Common/Types';
import slugify from 'slugify';
import { UploadCloudFileService } from 'src/Common/Services';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {}
  async createCategory(
    body: CreateCategoryDto,
    user: IAuthUser,
    image?: Express.Multer.File,
  ) {
    const isExist = await this.categoryRepository.findOne({
      filters: { name: body.name },
    });

    if (isExist) {
      throw new BadRequestException('Category already exists');
    }

    const folderId = Math.random().toString(36).slice(2, 10);
    const categoryData: any = {
      ...body,
      addedBy: user.user._id,
      folderId,
    };

    if (image) {
      const uploadedImage = await this.uploadCloudFileService.uploadFile(
        image.path,
        {
          folder: `${process.env.CLOUD_FOLDER_NAME}/Category/${folderId}`,
        },
      );

      categoryData.image = {
        secure_url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    const category = await this.categoryRepository.create(categoryData);

    if (!category) {
      throw new BadRequestException('Category not created');
    }

    return category;
  }
  async findAllCategory() {
    const categoires = await this.categoryRepository.findMany({});

    if (!categoires) throw new BadRequestException('Category not found');

    return categoires;
  }

  async findOneCategory(id: string) {
    const category = await this.categoryRepository.findOne({
      filters: { _id: id },
      populationArray: [
        { path: 'addedBy', select: 'firstName lastName email' },
      ],
    });
    if (!category) throw new BadRequestException('Category not found');
    return category;
  }

  async updateCategory(
    id: string,
    body: UpdateCategoryDto,
    user: IAuthUser,
    image?: Express.Multer.File,
  ) {
    const isExist = await this.findOneCategory(id);
    if (!isExist) throw new NotFoundException('Category not found');

    const isUniqueCategory = await this.categoryRepository.findOne({
      filters: {
        name: body.name,
      },
    });

    if (isUniqueCategory)
      throw new BadRequestException('Category already exists');

    const categoryData: any = {
      ...body,
      updatedBy: user.user._id,
    };

    if (body.name) {
      categoryData.slug = slugify(body.name || '', { lower: true, trim: true });
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
          folder: `${process.env.CLOUD_FOLDER_NAME}/Category/${isExist.folderId}`,
        },
      );

      categoryData.image = {
        secure_url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    const category = await this.categoryRepository.update({
      filters: { _id: id },
      body: categoryData,
    });
    if (!category) throw new BadRequestException('Category not updated');
    return category;
  }

  async removeCategory(id: string) {
    const category = await this.categoryRepository.deleteCategory(id);
    if (!category) throw new BadRequestException('Category not deleted');
    return category;
  }
}
