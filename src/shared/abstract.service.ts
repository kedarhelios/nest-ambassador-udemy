import { Repository } from 'typeorm';

export class AbstractService {
  select: {} = {};

  protected constructor(protected readonly repository: Repository<any>) {
    const entityMetadata: { columns: { propertyName: string }[] } =
      this.repository.metadata;

    const allColumns: string[] = entityMetadata.columns.map(
      (column) => column.propertyName,
    );

    this.select = allColumns.reduce((acc, column) => {
      acc[column] = true;
      return acc;
    }, {});
  }

  async save(options) {
    return this.repository.save(options);
  }

  async findOne(options) {
    return this.repository.findOne({
      select: this.select,
      where: options,
    });
  }

  async find(options: any, relations?: string[]) {
    return this.repository.find({
      select: this.select,
      where: options,
      relations: relations ?? null,
    });
  }

  async udpate(id: number, options) {
    return this.repository.update(id, options);
  }
}
