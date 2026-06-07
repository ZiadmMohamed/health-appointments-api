import { Injectable } from '@nestjs/common';
import { AskRepository } from '../Repository/ask.repo';

@Injectable()
export class AskService {
  constructor(private readonly askRepository: AskRepository) {}
// user
  async createAsk(body) {
    // patientId:user.id
    const newAsk = await this.askRepository.create(body);
    return newAsk;
  }
async findMyAsks(patientId: number) {
    return await this.askRepository.findByPatientId(patientId);
  }
}
