import { BaseError } from "./base.error";
import { CodeError } from "./code.error";

export class DuplicateEmailError extends BaseError {

    constructor(message: string) {
        super(message, CodeError.DuplicateEmail)
    }

}