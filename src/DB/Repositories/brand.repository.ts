import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Brand, type BrandType } from '../Models/brand.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadCloudFileService } from 'src/Common/Services';

@Injectable()
export class BrandRepository extends BaseService<BrandType> {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandType>,
    private readonly uploadCloudFileService: UploadCloudFileService,
  ) {
    super(brandModel);
  }

  async deleteBrand(id: string) {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (brand.image) {
      await this.uploadCloudFileService.DeleteFolderByPrefix(
        `${process.env.CLOUD_FOLDER_NAME}/Category/${brand.categoryId.toString()}/Brand/${brand.folderId}`,
      );
    }

    const deletedBrand = await this.brandModel.findByIdAndDelete(id);
    return deletedBrand;
  }
}
