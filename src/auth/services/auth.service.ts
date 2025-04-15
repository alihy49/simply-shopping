import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(createUserDto: CreateUserDto) {
    const existing = await this.userService.findByEmail(createUserDto.email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    return this.userService.createUser(createUserDto);
  }
}
