import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('admin')
@UseGuards(AuthGuard)
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('users/:id/links')
  async all(@Param('id', ParseIntPipe) id: number) {
    return await this.linkService.find({ user: id }, ['orders', 'user']);
  }
}
