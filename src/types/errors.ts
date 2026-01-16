export class InvalidSessionCookieError extends Error {
    constructor(message: string = "The provided session cookie is invalid, please double check it or create a new one") {
        super(message);
        this.name = "InvalidSessionCookieError";
    }
}

export class TooManyRatelimitErrors extends Error {
    constructor(message: string = "The server returned 429 too often, aborting further requests") {
        super(message);
        this.name = "TooManyRatelimitErrors";
    }
}