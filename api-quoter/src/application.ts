// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {PostgresDataSource} from './datasources';
import {UserEntityRepository} from './repositories';
import {MySequence} from './sequence';
import {AppJwtTokenServiceService, AuthService} from './services';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  TOKEN_EXPIRES_IN,
  TOKEN_SECRET,
} from './config';
export {ApplicationConfig};

export class TodoListApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.configureAuthentication();
    this.configureDatasource();
  }

  private configureAuthentication() {
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TOKEN_SECRET);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TOKEN_EXPIRES_IN);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(AuthService);

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(
      AppJwtTokenServiceService,
    );

    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      UserEntityRepository,
    );
    
  }

  private configureDatasource() {
    this.bind(PostgresDataSource.CONFIG_NAME).to({
      name: 'postgres',
      connector: 'postgresql',
      url: '',
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    });
    // Bind datasource
    this.dataSource(PostgresDataSource, UserServiceBindings.DATASOURCE_NAME);
  }
}
