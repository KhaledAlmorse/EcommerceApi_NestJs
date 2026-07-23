import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
  BrandRepository,
  CategoryRepository,
  SubCategoryRepository,
} from 'src/DB/Repositories';
import { IAuthUser } from 'src/Common/Types';
import slugify from 'slugify';
import { UploadCloudFileService } from 'src/Common/Services';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {}

  async createBrand(
    body: CreateBrandDto,
    user: IAuthUser,
    image?: Express.Multer.File,
  ) {
    const categoryExist = await this.categoryRepository.findOne({
      filters: { _id: body.categoryId },
    });

    if (!categoryExist) {
      throw new NotFoundException('Category not found');
    }

    const subCategoryExist = await this.subCategoryRepository.findOne({
      filters: { _id: body.subCategoryId },
    });

    if (!subCategoryExist) {
      throw new NotFoundException('SubCategory not found');
    }

    const isExist = await this.brandRepository.findOne({
      filters: { name: body.name },
    });

    if (isExist) {
      throw new BadRequestException('Brand already exists');
    }

    const folderId = Math.random().toString(36).slice(2, 10);
    const brandData: any = {
      ...body,
      addedBy: user.user._id,
      folderId,
    };

    if (image) {
      const uploadedImage = await this.uploadCloudFileService.uploadFile(
        image.path,
        {
          folder: `${process.env.CLOUD_FOLDER_NAME}/Category/${categoryExist.folderId}/Brand/${folderId}`,
        },
      );

      brandData.image = {
        secure_url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    const brand = await this.brandRepository.create(brandData);

    if (!brand) {
      throw new BadRequestException('Brand not created');
    }

    return brand;
  }

  async findAllBrand() {
    const brands = await this.brandRepository.findMany({
      populationArray: [
        { path: 'categoryId', select: 'name' },
        { path: 'subCategoryId', select: 'name' },
        { path: 'addedBy', select: 'firstName lastName email' },
      ],
    });

    if (!brands) throw new BadRequestException('Brand not found');

    return brands;
  }

  async findOneBrand(id: string) {
    const brand = await this.brandRepository.findOne({
      filters: { _id: id },
      populationArray: [
        { path: 'categoryId', select: 'name' },
        { path: 'subCategoryId', select: 'name' },
        { path: 'addedBy', select: 'firstName lastName email' },
      ],
    });
    if (!brand) throw new BadRequestException('Brand not found');
    return brand;
  }

  async updateBrand(
    id: string,
    body: UpdateBrandDto,
    user: IAuthUser,
    image?: Express.Multer.File,
  ) {
    const isExist = await this.brandRepository.findOne({
      filters: { _id: id },
    });
    if (!isExist) throw new NotFoundException('Brand not found');

    if (body.name) {
      const isUniqueBrand = await this.brandRepository.findOne({
        filters: {
          name: body.name,
        },
      });
      if (isUniqueBrand && isUniqueBrand._id.toString() !== id) {
        throw new BadRequestException('Brand already exists');
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

    if (body.subCategoryId) {
      const subCategoryExist = await this.subCategoryRepository.findOne({
        filters: { _id: body.subCategoryId },
      });
      if (!subCategoryExist) {
        throw new NotFoundException('SubCategory not found');
      }
    }

    const brandData: any = {
      ...body,
      updatedBy: user.user._id,
    };

    if (body.name) {
      brandData.slug = slugify(body.name || '', { lower: true, trim: true });
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
          folder: `${process.env.CLOUD_FOLDER_NAME}/Category/${categoryFolderId}/Brand/${isExist.folderId}`,
        },
      );

      brandData.image = {
        secure_url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    const brand = await this.brandRepository.update({
      filters: { _id: id },
      body: brandData,
    });
    if (!brand) throw new BadRequestException('Brand not updated');
    return brand;
  }

  async removeBrand(id: string) {
    const brand = await this.brandRepository.deleteBrand(id);
    if (!brand) throw new BadRequestException('Brand not deleted');
    return brand;
  }
}
