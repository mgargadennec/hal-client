"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var resource_1 = require("./resource");
var hal_client_options_1 = require("./hal-client-options");
var XMLHttpRequestResourceClient = /** @class */ (function () {
    function XMLHttpRequestResourceClient(_resource) {
        this._resource = _resource;
    }
    XMLHttpRequestResourceClient.prototype.$delete = function (rel, urlParams, options) {
        return this.$request('DELETE', rel, urlParams, undefined, options);
    };
    XMLHttpRequestResourceClient.prototype.$deleteSelf = function (urlParams, options) {
        return this.$delete('self', urlParams, options);
    };
    XMLHttpRequestResourceClient.prototype.$get = function (rel, urlParams, options) {
        return this.$request('GET', rel, urlParams, undefined, options);
    };
    XMLHttpRequestResourceClient.prototype.$getSelf = function (options) {
        return this.$get('self', undefined, options);
    };
    XMLHttpRequestResourceClient.prototype.$link = function (rel, links, urlParams, options) {
        options = options || {};
        options.headers = options.headers || {};
        options.headers.Link = links;
        return this.$request('LINK', rel, urlParams, undefined, options);
    };
    XMLHttpRequestResourceClient.prototype.$linkSelf = function (links, options) {
        return this.$link('self', links, options);
    };
    XMLHttpRequestResourceClient.prototype.$patch = function (rel, urlParams, body, options) {
        return this.$request('PATCH', rel, urlParams, body, options);
    };
    XMLHttpRequestResourceClient.prototype.$patchSelf = function (payload, options) {
        return this.$patch('self', undefined, payload, options);
    };
    XMLHttpRequestResourceClient.prototype.$post = function (rel, urlParams, body, options) {
        return this.$request('POST', rel, urlParams, body, options);
    };
    XMLHttpRequestResourceClient.prototype.$postSelf = function (payload, options) {
        return this.$post('self', undefined, payload, options);
    };
    XMLHttpRequestResourceClient.prototype.$put = function (rel, urlParams, body, options) {
        return this.$request('PUT', rel, urlParams, body, options);
    };
    XMLHttpRequestResourceClient.prototype.$putSelf = function (payload, options) {
        return this.$put('self', undefined, payload, options);
    };
    XMLHttpRequestResourceClient.prototype.$request = function (method, rel, urlParams, body, options) {
        method = method || 'GET';
        rel = rel || 'self';
        urlParams = urlParams || {};
        body = body || null;
        options = options || {};
        if (this._resource.$hasEmbedded(rel) && Array.isArray(this._resource.$getEmbedded(rel)) && !options['prefersLink']) {
            var promises = [];
            var embeddedResource = this._resource.$getEmbedded(rel);
            for (var i = 0; i < embeddedResource.length; i++) {
                promises.push(embeddedResource[i]
                    .$request()
                    .$request(method, 'self', urlParams, body, options));
            }
            return Promise.all(promises);
        }
        if (this._resource.$hasEmbedded(rel) && !options['prefersLink']) {
            var embeddedResource = this._resource.$getEmbedded(rel);
            if (embeddedResource) {
                return embeddedResource
                    .$request()
                    .$request(method, 'self', urlParams, body, options);
            }
        }
        if (this._resource.$hasLink(rel)) {
            var url = this._resource.$href(rel, urlParams);
            if (Array.isArray(url)) {
                var promises = [];
                for (var j = 0; j < url.length; j++) {
                    promises.push(this.performRequest(method, url[j], body, options));
                }
                return Promise.all(promises);
            }
            if (url) {
                return this.performRequest(method, url, body, options);
            }
        }
        return Promise.reject(new Error('link "' + rel + '" is undefined'));
    };
    XMLHttpRequestResourceClient.prototype.$unlink = function (rel, links, urlParams, options) {
        options = options || {};
        options.headers = options.headers || {};
        options.headers.Link = links;
        return this.$request('UNLINK', rel, urlParams, undefined, options);
    };
    XMLHttpRequestResourceClient.prototype.$unlinkSelf = function (links, options) {
        return this.$unlink('self', links, options);
    };
    XMLHttpRequestResourceClient.prototype.performRequest = function (method, url, body, options) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            hal_client_options_1.halClientOptions.headers.forEach(function (value, key) {
                xhr.setRequestHeader(key, value);
            });
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    if (this.status === 204 || !xhr.responseText) {
                        resolve(new resource_1.ResourceImpl({}, xhr.getAllResponseHeaders()));
                        return;
                    }
                    var obj = JSON.parse(xhr.responseText);
                    if (Array.isArray(obj)) {
                        resolve(obj.map(function (item) { return new resource_1.ResourceImpl(item, xhr.getAllResponseHeaders()); }));
                        return;
                    }
                    else {
                        resolve(new resource_1.ResourceImpl(obj, xhr.getAllResponseHeaders()));
                        return;
                    }
                }
                else {
                    var errorResponse = xhr.responseText ? __assign({}, JSON.parse(xhr.responseText)) : {
                        status: this.status,
                        statusText: xhr.statusText
                    };
                    reject(errorResponse);
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            if (body) {
                xhr.send(JSON.stringify(body));
            }
            else {
                xhr.send();
            }
        });
    };
    return XMLHttpRequestResourceClient;
}());
exports.XMLHttpRequestResourceClient = XMLHttpRequestResourceClient;
