import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(options) {
    return this.userRepository.save(options);
  }

  async findOne(options) {
    return this.userRepository.findOne({
      select: {
        email: true,
        password: true,
        first_name: true,
        last_name: true,
        id: true,
        is_ambassador: true,
      },
      where: options,
    });
  }

  async udpate(id: number, options) {
    return this.userRepository.update(id, options);
  }

  async getAllAmbassadors() {
    return this.userRepository.find({
      select: {
        email: true,
        password: true,
        first_name: true,
        last_name: true,
        id: true,
        is_ambassador: true,
      },
      where: { is_ambassador: true },
      order: { id: 'ASC' },
    });
  }
}
