import {model, property} from '@loopback/repository';
import {UserEntity} from '../../models';

@model()
export class NewUserRequest extends UserEntity {}
@model()
export class NewUserResponse extends UserEntity {}
@model()
export class Credentials {
  @property({
    type: 'string',
    required: true,
  })
  email: string;
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
@model()
export class LoginResponse {
  @property({
    type: 'string',
    required: true,
  })
  token: string;
}
