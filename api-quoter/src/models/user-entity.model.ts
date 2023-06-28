import {Entity, model, property} from '@loopback/repository';

@model()
export class UserEntity extends Entity {
  @property({
    id: true,
    type: 'String',
    required: false,
    generated: true,
    useDefaultIdType: false,
    postgresql: {
      dataType: 'uuid',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  password: string;

  @property({
    type: 'boolean',
    required: true,
  })
  enabled: boolean;

  constructor(data?: Partial<UserEntity>) {
    super(data);
  }
}

export interface UserEntityRelations {
  // describe navigational properties here
}

export type UserEntityWithRelations = UserEntity & UserEntityRelations;
