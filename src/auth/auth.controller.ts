import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

import { RegisterUsuarioDto, LoginUsuarioDto } from './dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Crear cuenta
  @Post('register')
  create(@Body() registerUsuarioDto: RegisterUsuarioDto) {
    return this.authService.register( registerUsuarioDto );
  }

  //inciar sesion
  @Post('login')
  login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    return this.authService.login( loginUsuarioDto );
  }

}
