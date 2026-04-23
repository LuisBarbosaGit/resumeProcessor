import { AppError } from "./AppError.js";

export class EmailAlreadyExists extends AppError {
  constructor() {
    super("Esse email já foi cadastrado", 409);
  }
}
