import type { IJobRepository } from "../repositories/jobRepository.js";

export class ListJobsService {
  constructor(private readonly repository: IJobRepository) {}

  async execute() {
    return this.repository.findAll();
  }
}
