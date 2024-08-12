import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('admin')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
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

  @Post('/login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.findOne({ email: body.email });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Invalid Password!');
    }

    const jwt = await this.createJwtToken(user.id);

    res.cookie('jwt', jwt, { httpOnly: true });

    return { message: 'success' };
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async user(@Req() req: Request) {
    const cookie = req.cookies['jwt'];

    const { id } = await this.jwtService.verifyAsync(cookie);

    const user = await this.userService.findOne({ id });

    return user;
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');

    return { message: 'success' };
  }

  @Patch('/update')
  @UseGuards(AuthGuard)
  async update(@Req() req: Request, @Body() body) {
    await this.userService.udpate(req.user as number, body);
    return await this.userService.findOne({ id: req.user as number });
  }

  private async createJwtToken(user_id: number) {
    return this.jwtService.signAsync({
      id: user_id,
    });
  }
}
