import { JobNotFound } from "../errors/JobNotFound.js";
import type { IJobRepository } from "../repositories/jobRepository.js";

export class GetJobService {
  constructor(private readonly repository: IJobRepository) {}

  async execute(id: string) {
    const job = await this.repository.findById(id);

    if (!job) {
      throw new JobNotFound();
    }

    return job;
  }
}
