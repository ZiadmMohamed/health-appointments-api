// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-local';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
//   constructor() {
//     // private authService: AuthService
//     super({
//       usernameField: 'email', // أو 'username'
//       passwordField: 'password',
//     });
//   }

//   validate(email: string, password: string): Promise<any> {
//     // const user = await this.authService.validateUser(email, password);

//     if (!email || !password) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // user object
//     return {
//       userId: '123',
//       email,
//       username: 'john',
//     };
//   }
// }
