import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ask } from '../entity/ask.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AskRepository {
  constructor(
    @InjectRepository(Ask) private readonly askRepo: Repository<Ask>,
  ) {}
  // Implement repository methods for AskEntity here
  async create(data: Partial<Ask>): Promise<Ask> {
    const newAsk = this.askRepo.create(data);
    return await this.askRepo.save(newAsk);
  }

  async findAll(): Promise<Ask[]> {
    return await this.askRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Ask> {
    const ask = await this.askRepo.findOne({ where: { id } });
    if (!ask) {
      throw new NotFoundException(`Ask with ID ${id} not found`);
    }
    return ask;
  }

  async updateAsk(id: number, data: Partial<Ask>): Promise<UpdateResult> {
    await this.findOne(id);
    return await this.askRepo.update(id, data);
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.askRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ask with ID ${id} not found`);
    }
    return result;
  }
  async findByPatientId(patientId: number): Promise<Ask[]> {
    return await this.askRepo.find({
      where: { patientId: patientId  }, 
      order: { createdAt: 'DESC' },
    });
  }
}
