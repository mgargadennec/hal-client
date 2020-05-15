"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resource_client_1 = require("./resource-client");
var uriTemplate = require("uri-templates");
var nonenumerable = function (target, propertyKey) {
    var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    if (descriptor.enumerable !== false) {
        descriptor.enumerable = false;
        Object.defineProperty(target, propertyKey, descriptor);
    }
};
var ResourceImpl = /** @class */ (function () {
    function ResourceImpl(content, allHeaders) {
        var _this = this;
        this._embedded = new Map();
        this._links = new Map();
        this._client = new resource_client_1.XMLHttpRequestResourceClient(this);
        //Parse headers
        var arr = allHeaders.split('\r\n');
        var parsedHeaders = arr.reduce(function (acc, current, i) {
            var parts = current.split(': ');
            if (parts[0].length > 0) {
                acc[parts[0]] = parts[1];
            }
            return acc;
        }, {});
        this._headers = new Headers(parsedHeaders);
        Object.keys(content).forEach(function (key) {
            if (key === '_links') {
                Object.keys(content[key]).forEach(function (linkRelation) {
                    if (Array.isArray(content[key][linkRelation])) {
                        _this._links.set(linkRelation, content[key][linkRelation].map(function (it) { return it; }));
                    }
                    else {
                        _this._links.set(linkRelation, content[key][linkRelation]);
                    }
                });
            }
            else if (key === '_embedded') {
                Object.keys(content[key]).forEach(function (embeddedRelation) {
                    if (Array.isArray(content[key][embeddedRelation])) {
                        _this._embedded.set(embeddedRelation, content[key][embeddedRelation].map(function (it) { return new ResourceImpl(it, ''); }));
                    }
                    else {
                        _this._embedded.set(embeddedRelation, new ResourceImpl(content[key][embeddedRelation], ''));
                    }
                });
            }
            else {
                Object.defineProperty(_this, key, {
                    configurable: false,
                    enumerable: true,
                    writable: false,
                    value: content[key]
                });
            }
        });
        nonenumerable(this, '_links');
        nonenumerable(this, '_embedded');
        nonenumerable(this, '_client');
    }
    ResourceImpl.prototype.state = function () {
        var _this = this;
        var state = {};
        Object.keys(this).forEach(function (key) {
            state[key] = _this[key];
        });
        return state;
    };
    ResourceImpl.prototype.headers = function () {
        return this._headers;
    };
    ResourceImpl.prototype.$has = function (rel) {
        return this._embedded.has(rel) || this._links.has(rel);
    };
    ResourceImpl.prototype.$hasEmbedded = function (rel) {
        return this._embedded.has(rel) && this._embedded.get(rel) != undefined;
    };
    ResourceImpl.prototype.$hasLink = function (rel) {
        return this._links.has(rel) && this._links.get(rel) != undefined;
    };
    ResourceImpl.prototype.$href = function (rel, parameters) {
        var _this = this;
        var links = this.$link(rel);
        if (!links)
            return undefined;
        var callback = function (link) { return link.templated ? _this.generateUrl(link.href, parameters) : link.href; };
        if (Array.isArray(links)) {
            return links.map(callback);
        }
        return callback(links);
    };
    ResourceImpl.prototype.$link = function (rel) {
        if (!this.$hasLink(rel)) {
            throw new Error('Link with relation "' + rel + '" is undefined');
        }
        return this._links.get(rel);
    };
    ResourceImpl.prototype.$request = function () {
        return this._client;
    };
    ResourceImpl.prototype.$getEmbedded = function (rel) {
        return this._embedded.get(rel);
    };
    ResourceImpl.prototype.generateUrl = function (href, parameters) {
        return uriTemplate(href).fill(parameters);
    };
    return ResourceImpl;
}());
exports.ResourceImpl = ResourceImpl;
