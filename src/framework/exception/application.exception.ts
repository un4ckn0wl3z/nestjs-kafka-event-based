import { CustomError } from 'ts-custom-error'
 
export class UnExpectedError extends CustomError {
    public constructor(
        public code: number,
        message?: string,
    ) {
        super(message)
    }
}


export class UnExpectedHttpError extends CustomError {
    public constructor(
        public code: number,
        message?: string,
    ) {
        super(message)
    }
}