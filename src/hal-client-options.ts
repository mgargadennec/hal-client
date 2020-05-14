export class HalClientOptions {

    constructor(private _headers: Headers) {
    }

    get headers(): Headers {
        return this._headers
    }
}

export const halClientOptions = new HalClientOptions(new Headers({
    'Accept': 'application/hal+json',
    'Content-Type': 'application/json',
}));
