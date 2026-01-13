export class InvalidSessionCookieError extends Error {
    constructor(message: string = "The provided session cookie is invalid, please double check it or create a new one") {
        super(message);
        this.name = "InvalidSessionCookieError";
    }
}