import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { CreateUserDto } from "apps/app/src/modules/auth/dtos/create-user.dto";
import { User } from "./entities/user.entity";



@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository, 
  ) {}

  async findUserById(id: number) {
    return this.userRepository.findById(id);
  }

  async findUserByEmail(email: string, selectPassword?: boolean) {
    return this.userRepository.findByEmail(email, selectPassword);
  }

  async findUserByPhone(phone: string) {
    return this.userRepository.findOne({ where: { phone }, select: ['id', 'phone', 'password', 'isActive', 'tokenVersion'] });
  }

  async createUser(data: CreateUserDto) {
    return this.userRepository.createUser(data);
  }

  async updateUser(id: number, data: Partial<User>) {
    return this.userRepository.updateUser(id, data);
  }

  
}
