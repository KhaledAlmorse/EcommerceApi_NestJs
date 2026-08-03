import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product-dto';
import {
  CreateProductDto,
  listProductQueryDto,
} from './dto/create-product-dto';
import { ProductRepository, CategoryRepository } from '../DB/Repositories';
import type { IAuthUser } from '../Common/Types';
import { CategoryService } from '../category/category.service';
import { UploadCloudFileService } from '../Common/Services';
import { ProductType } from '../DB/Models';
import { Types } from 'mongoose';
import { filter } from 'rxjs';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly CategoryService: CategoryService,
    private readonly uploadCloudFileService: UploadCloudFileService,
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
  ) {}

  async createProduct(
    body: CreateProductDto,
    user: IAuthUser,
    images: Array<Express.Multer.File>,
  ) {
    const addedBy = user.user._id;
    const { title, description, basePrice, discount, stock, categoryId } = body;

    const categoryExist = await this.CategoryService.findOneCategory(
      categoryId as string,
    );

    if (!categoryExist) throw new NotFoundException('Category not found');

    const uniqueProduct = await this.productRepository.findOne({
      filters: { title },
    });
    if (uniqueProduct) throw new BadRequestException('Product already exists');

    const productObj: Partial<ProductType> = {
      title,
      description,
      basePrice,
      stock,
      discount,
      categoryId: new Types.ObjectId(categoryId),
      addedBy,
    };

    if (!images?.length)
      throw new BadRequestException('You must upload at least one image');

    const folderId = Math.random().toString(36).slice(2, 10);
    productObj.folderId = folderId;
    const folder = `${process.env.CLOUD_FOLDER_NAME}/Category/${categoryExist.folderId}/products/${folderId}`;
    const paths = images.map((image) => image.path);

    productObj.images = await this.uploadCloudFileService.UploadFiles(paths, {
      folder,
    });

    const newProduct = await this.productRepository.create(productObj);

    if (!newProduct) throw new BadRequestException('Failed to create product');

    return newProduct;
  }

  async buildProductList() {
    const products = await this.productRepository.findMany({
      filters: {},
    });
    const data = await this.cacheManager.set('list_products', products);

    return data;
  }

  async findAllProducts(query: listProductQueryDto) {
    const { limit = 10, page = 1, sort, ...filters } = query;
    //{price:{lt:50,gt:40}}
    //{price:{$lt:50,$gt:40}}
    const filterString = JSON.stringify(filters).replace(
      /\b(lt|gt|lte|gte)\b/g,
      (match) => `$${match}`,
    );
    const filterObj = JSON.parse(filterString);
    const skip = (page - 1) * limit;
    const options = {
      limit,
      skip,
      sort: sort,
      filters: filterObj,
    };
    const resutl = await this.productRepository.findMany(options);
    if (!resutl) throw new BadRequestException('Failed to find products');
    const count = resutl.length;
    return { count, resutl };
    //* Get data from cache
    // const products = await this.cacheManager.get('list_products');
    // if (!products) {
    //   throw new NotFoundException('Products not found');
    // }
    // return products;
  }

  async findProduct(id: string) {
    const product = await this.productRepository.findOne({
      filters: { _id: id },
      populationArray: [
        {
          path: 'addedBy',
          select: 'name',
        },
        {
          path: 'categoryId',
          select: 'name',
        },
      ],
    });
    if (!product) throw new BadRequestException('Product not found');
    return product;
  }
}
