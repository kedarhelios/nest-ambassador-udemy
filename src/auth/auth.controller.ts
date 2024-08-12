import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('admin/register')
  async register(@Body() body: RegisterDto) {
    const { password_confirm, ...data } = body;

    if (body.password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    await this.userService.save({
      ...data,
      password: hashed,
      is_ambassador: false,
    });
    return { data: data.email };
  }
}
