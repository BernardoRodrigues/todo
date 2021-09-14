import { BaseError } from "./base.error";

export class InvalidCredentialsError extends BaseError {

    constructor(message: string, public code: number) {
        super(message, code)
    }

}