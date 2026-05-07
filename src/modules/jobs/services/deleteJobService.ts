import { JobNotFound } from "../errors/JobNotFound.js";
import type { IJobRepository } from "../repositories/jobRepository.js";

export class DeleteJobService {
  constructor(private readonly repository: IJobRepository) {}

  async execute(id: string) {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new JobNotFound();
    }

    const removed = await this.repository.delete(id);

    if (!removed) {
      throw new JobNotFound();
    }
  }
}
