"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HalClientOptions = /** @class */ (function () {
    function HalClientOptions(_headers) {
        this._headers = _headers;
    }
    Object.defineProperty(HalClientOptions.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        enumerable: true,
        configurable: true
    });
    return HalClientOptions;
}());
exports.HalClientOptions = HalClientOptions;
exports.halClientOptions = new HalClientOptions(new Headers({
    'Accept': 'application/hal+json',
    'Content-Type': 'application/json',
}));
