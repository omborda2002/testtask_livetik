import { Body, Controller, Post } from '@nestjs/common';

import { LoginUserDto } from '../../application/dto/login-user.dto';
import { UserService } from '../../application/services/user.service';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { ChangePasswordDto } from '../../application/dto/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.userService.registerUser(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.loginUser(dto);
  }

  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(dto);
  }
}
