import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../shared/abstract.service';
import { Link } from './entity/link.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LinkService extends AbstractService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
  ) {
    super(linkRepository);
  }
}
