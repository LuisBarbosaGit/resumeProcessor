import { JobNotFound } from "../errors/JobNotFound.js";
import type { UpdateJobBody } from "../schema.js";
import type { IJobRepository, UpdateJobDTO } from "../repositories/jobRepository.js";

export class UpdateJobService {
  constructor(private readonly repository: IJobRepository) {}

  async execute(id: string, input: UpdateJobBody) {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new JobNotFound();
    }

    const patch = Object.fromEntries(
      Object.entries(input).filter(([, value]) => value !== undefined),
    ) as UpdateJobDTO;

    const updated = await this.repository.update(id, patch);

    if (!updated) {
      throw new JobNotFound();
    }

    return updated;
  }
}
