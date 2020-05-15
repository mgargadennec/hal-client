"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resource_1 = require("./resource");
var hal_client_options_1 = require("./hal-client-options");
function createClient(url, options) {
    if (options === void 0) { options = hal_client_options_1.halClientOptions; }
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        options.headers.forEach(function (value, key) {
            xhr.setRequestHeader(key, value);
        });
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.status === 204 || !xhr.responseText) {
                    return resolve(new resource_1.ResourceImpl({}, xhr.getAllResponseHeaders()));
                }
                var obj = JSON.parse(xhr.responseText);
                if (obj instanceof Array) {
                    throw new Error('The API root should be a single resource, not a list');
                }
                else {
                    resolve(new resource_1.ResourceImpl(obj, xhr.getAllResponseHeaders()));
                }
            }
            else {
                throw new Error('The API root should be a single resource, not a list');
            }
        };
        xhr.onerror = function () {
            throw new Error('The API root should be a single resource, not a list');
        };
        xhr.send();
    });
}
exports.createClient = createClient;
