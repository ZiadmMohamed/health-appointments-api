import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { CreateUserDto } from "../../auth/src/dtos/create-user.dto";


@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository, 
  ) {}
}
