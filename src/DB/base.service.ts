import {
  Model,
  QueryFilter,
  PopulateOptions,
  Document,
  SortOrder,
  UpdateQuery,
} from 'mongoose';

interface findOneOptions<TDocument> {
  filters: QueryFilter<TDocument>;
  select?: string;
  populationArray?: PopulateOptions[];
}
interface findManyOptions<TDocument> {
  filters?: QueryFilter<TDocument>;
  select?: string;
  populationArray?: PopulateOptions[];
  limit?: number;
  skip?: number;
  sort?: { [key: string]: SortOrder };
}

interface updateOptions<TDocument> {
  filters: QueryFilter<TDocument>;
  body: UpdateQuery<TDocument>;
}

interface deleteOptions<TDocument> {
  filters: QueryFilter<TDocument>;
}

interface deleteManyOptions<TDocument> {
  filters: QueryFilter<TDocument>;
}

export abstract class BaseService<TDocument extends Document> {
  constructor(private readonly model: Model<TDocument>) {}

  async save(newDocument: TDocument) {
    return await newDocument.save();
  }

  async create(document: Partial<TDocument>): Promise<TDocument> {
    return await this.model.create(document);
  }

  async findOne(options: findOneOptions<TDocument>): Promise<TDocument | null> {
    if (options.filters._id) {
      return await this.model
        .findById(options.filters._id)
        .select(options.select ?? '')
        .populate(options.populationArray ?? [])
        .exec();
    }
    return await this.model
      .findOne(options.filters)
      .select(options.select ?? '')
      .populate(options.populationArray ?? [])
      .exec();
  }

  async findMany(
    options: findManyOptions<TDocument>,
  ): Promise<TDocument[] | null> {
    const query = this.model.find(options.filters ?? {});

    if (options.populationArray) {
      query.populate(options.populationArray);
    }

    if (options.sort) {
      query.sort(options.sort);
    }

    if (options.select) {
      query.select(options.select);
    }
    if (options.skip || options.limit) {
      query.limit(options.limit ?? 10).skip(options.skip ?? 0);
    }

    return await query.exec();
  }

  async update(options: updateOptions<TDocument>): Promise<TDocument | null> {
    if (options.filters._id) {
      return await this.model
        .findByIdAndUpdate(options.filters._id, options.body, { new: true })
        .exec();
    }
    return await this.model
      .findOneAndUpdate(options.filters, options.body, { new: true })
      .exec();
  }

  async delete(options: deleteOptions<TDocument>): Promise<TDocument | null> {
    if (options.filters._id) {
      return await this.model.findByIdAndDelete(options.filters._id).exec();
    }
    return await this.model.findOneAndDelete(options.filters).exec();
  }
  async deleteMany(options: deleteManyOptions<TDocument>) {
    return await this.model.deleteMany(options.filters).exec();
  }
}
