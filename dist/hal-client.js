"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resource_1 = require("./resource");
function createClient(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/hal+json, application/json');
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.status === 204 || !xhr.responseText) {
                    return resolve(undefined);
                }
                var obj = JSON.parse(xhr.responseText);
                if (obj instanceof Array) {
                    throw new Error('The API root should be a single resource, not a list');
                }
                else {
                    resolve(new resource_1.ResourceImpl(obj));
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
