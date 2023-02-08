export class DataDuplicatedError extends Error {
    public code: number;
    public constructor(
        message?: string,
    ) {
        super(message = 'Data duplicated')
        this.name = this.constructor.name
        this.code = 40001
    }
}


export class UnExpectedError extends Error {
    public code: number;
    public constructor(
        message?: string,
    ) {
        super(message = 'Unexpected Error')
        this.name = this.constructor.name
        this.code = 50001
    }
}


export class UnExpectedHttpError extends Error {
    public code: number;
    public constructor(
        message?: string,
    ) {
        super(message = 'Unexpected HTTP Error')
        this.name = this.constructor.name
        this.code = 50002
    }
}