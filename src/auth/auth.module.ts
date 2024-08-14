import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
