import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {UserEntity, UserEntityRelations} from '../models';

export class UserEntityRepository extends DefaultCrudRepository<
  UserEntity,
  typeof UserEntity.prototype.id,
  UserEntityRelations
> {
  constructor(@inject('datasources.postgres') dataSource: PostgresDataSource) {
    super(UserEntity, dataSource);
  }
  async findCredentials(
    userId: typeof UserEntity.prototype.id,
  ): Promise<UserEntity | undefined> {
    return this.findById(userId).catch(err => {
      if (err.code === 'ENTITY_NOT_FOUND') return undefined;
      throw err;
    });
  }
}
