import {UserService} from '@loopback/authentication';
import {Credentials, User} from '@loopback/authentication-jwt';
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {compare, genSalt, hash} from 'bcryptjs';
import {UserEntity} from '../models';
import {UserEntityRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService implements UserService<User, Credentials> {
  constructor(
    @repository(UserEntityRepository)
    public userRepository: UserEntityRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await compare(
      credentials.password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const result = {
      email: foundUser.email,
      id: foundUser.id,
      emailVerified: true,
      realm: 'AppRealm',
      username: foundUser.name,
      verificationToken: 'no_token',
      userCredentials: {
        id: foundUser.id,
        password: '',
        userId: foundUser.id,
      },
    } as User;

    return result;
  }

  convertToUserProfile(user: User): UserProfile {
    const profile: UserProfile = {
      [securityId]: user.id.toString(),
      email: user.email,
      name: user.username,
      custom: 'test',
    };
    return profile;
  }

  public async signup(userData: UserEntity): Promise<UserEntity> {
    const userFound = await this.userRepository.findOne({
      where: {email: userData.email},
    });

    if (userFound) {
      throw new HttpErrors.Conflict(
        `Your email ${userData.email} already exists`,
      );
    }

    const hashedPassword = await this.hashPassword(userData.password);
    const userToInsert = {
      ...userData,
      password: hashedPassword,
      enabled: true,
    } as UserEntity;

    const createUserData = await this.userRepository.create(userToInsert);
    return createUserData;
  }

  async hashPassword(password: string) {
    password = await hash(password, await genSalt());
    return password;
  }
}
