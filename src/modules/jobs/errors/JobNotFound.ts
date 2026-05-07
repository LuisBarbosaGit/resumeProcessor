import { AppError } from "../../resume/errors/AppError.js";

export class JobNotFound extends AppError {
  constructor() {
    super("Vaga nao encontrada", 404);
  }
}
