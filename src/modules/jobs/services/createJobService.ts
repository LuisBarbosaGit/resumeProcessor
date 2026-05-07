import type { CreateJobBody } from "../schema.js";
import type { IJobRepository } from "../repositories/jobRepository.js";

export class CreateJobService {
  constructor(private readonly repository: IJobRepository) {}

  async execute(input: CreateJobBody) {
    return this.repository.create({
      title: input.title,
      description: input.description,
    });
  }
}
