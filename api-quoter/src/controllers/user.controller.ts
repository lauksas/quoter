import {authenticate, TokenService} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {UserEntity} from '../models';
import {UserEntityRepository} from '../repositories';
import {AuthService} from '../services';
import {
  Credentials,
  LoginResponse,
  NewUserRequest,
  NewUserResponse,
} from './models';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserEntityRepository)
    protected userRepository: UserEntityRepository,
    @inject(UserServiceBindings.USER_SERVICE)
    protected authService: AuthService,
  ) {}

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: getModelSchemaRef(LoginResponse),
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credentials),
        },
      },
    })
    credentials: Credentials,
  ): Promise<LoginResponse> {
    // ensure the user exists, and the password is correct
    const user = await this.authService.verifyCredentials(
      credentials as UserEntity,
    );
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.authService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(NewUserResponse, {
              exclude: ['password'],
            }),
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            exclude: ['id', 'enabled'],
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<NewUserResponse> {
    const savedUser = this.authService.signup(newUserRequest);
    return savedUser;
  }
}
