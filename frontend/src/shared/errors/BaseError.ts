export class BaseError extends Error {
    status?: number;

    constructor(message: string,status?:number) {
        super(message);
        this.name = 'BaseError';
        this.status = status;

        Object.setPrototypeOf(this,new.target.prototype);
    }
}