import {Parameters, Resource, ResourceImpl} from './resource';
import {halClientOptions} from './hal-client-options';

export interface ResourceClient {
    $request(method: string, rel: string, urlParams?: Parameters, body?: any, options?: Object): Promise<Resource | Resource[]>;

    $get(rel: string, urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;

    $post(rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]>;

    $put(rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]>

    $patch(rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]>

    $delete(rel: string, urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;

    $link(rel: string, links: string[], urlParams?: Parameters, options ?: any): Promise<Resource | Resource[]>;

    $unlink(rel: string, links: string[], urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;

    $getSelf(options?: any): Promise<Resource | Resource[]>;

    $putSelf(payload: any, options?: any): Promise<Resource | Resource[]>;

    $postSelf(payload: any, options?: any): Promise<Resource | Resource[]>;

    $patchSelf(payload: any, options?: any): Promise<Resource | Resource[]>;

    $deleteSelf(urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;

    $linkSelf(links: string[], options?: any): Promise<Resource | Resource[]>;

    $unlinkSelf(links: string[], options?: any): Promise<Resource | Resource[]>;

}

export class XMLHttpRequestResourceClient implements ResourceClient {
    constructor(private _resource: Resource) {
    }

    $delete(rel: string, urlParams?: Parameters, options?: any): Promise<Resource | Resource[]> {
        return this.$request('DELETE', rel, urlParams, undefined, options);
    }

    $deleteSelf(urlParams?: Parameters, options?: any): Promise<Resource | Resource[]> {
        return this.$delete('self', urlParams, options);
    }

    $get(rel: string, urlParams?: Parameters, options?: any): Promise<Resource | Resource[]> {
        return this.$request('GET', rel, urlParams, undefined, options);
    }

    $getSelf(options?: Object): Promise<Resource | Resource[]> {
        return this.$get('self', undefined, options);
    }

    $link(rel: string, links: string[], urlParams?: Parameters, options?: any): Promise<Resource | Resource[]> {
        options = options || {};
        options.headers = options.headers || {};
        options.headers.Link = links;
        return this.$request('LINK', rel, urlParams, undefined, options);
    }

    $linkSelf(links: string[], options?: any): Promise<Resource | Resource[]> {
        return this.$link('self', links, options);
    }

    $patch(rel: string, urlParams?: Parameters, body?: any | null, options?: any): Promise<Resource | Resource[]> {
        return this.$request('PATCH', rel, urlParams, body, options);
    }

    $patchSelf(payload: any, options?: any): Promise<Resource | Resource[]> {
        return this.$patch('self', undefined,payload, options);
    }

    $post(rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]> {
        return this.$request('POST', rel, urlParams, body, options);
    }

    $postSelf(payload: any, options?: any): Promise<Resource | Resource[]> {
        return this.$post('self', undefined, payload, options);
    }

    $put(rel: string, urlParams?: Parameters, body?: any | null, options?: any): Promise<Resource | Resource[]> {
        return this.$request('PUT', rel, urlParams, body, options);
    }

    $putSelf(payload: any, options?: any): Promise<Resource | Resource[]> {
        return this.$put('self', undefined, payload, options);
    }

    $request(method: string, rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]> {
        method = method || 'GET';
        rel = rel || 'self';
        urlParams = urlParams || {};
        body = body || null;
        options = options || {};

        if (this._resource.$hasEmbedded(rel) && Array.isArray(this._resource.$getEmbedded(rel)) && !options['prefersLink']) {
            const promises: Promise<Resource>[] = [];
            const embeddedResource: Resource[] = this._resource.$getEmbedded(rel) as Resource[];
            for (let i = 0; i < embeddedResource.length; i++) {
                promises.push(
                    embeddedResource[i]
                        .$request()
                        .$request(method, 'self', urlParams, body, options) as Promise<Resource>
                );
            }
            return Promise.all(promises) as Promise<Resource[]>;
        }

        if (this._resource.$hasEmbedded(rel) && !options['prefersLink']) {
            const embeddedResource: Resource = this._resource.$getEmbedded(rel) as Resource;
            if (embeddedResource) {
                return embeddedResource
                    .$request()
                    .$request(method, 'self', urlParams, body, options) as Promise<Resource>;
            }
        }

        if (this._resource.$hasLink(rel)) {
            const url: string | string[] | undefined = this._resource.$href(rel, urlParams);
            if (Array.isArray(url)) {
                const promises: Promise<any>[] = [];
                for (let j = 0; j < url.length; j++) {
                    promises.push(
                        this.performRequest(method, url[j], body, options)
                    );
                }
                return Promise.all(promises) as Promise<Resource[]>;
            }
            if (url) {
                return this.performRequest(method, url, body, options);
            }
        }

        return Promise.reject(new Error('link "' + rel + '" is undefined'));
    }

    $unlink(rel: string, links: string[], urlParams?: Parameters, options?: any): Promise<Resource | Resource[]> {
        options = options || {};
        options.headers = options.headers || {};
        options.headers.Link = links;
        return this.$request('UNLINK', rel, urlParams, undefined, options);
    }

    $unlinkSelf(links: string[], options?: any): Promise<Resource | Resource[]> {
        return this.$unlink('self', links, options);
    }

    private performRequest(method: string, url: string, body: any, options: any): Promise<Resource | Resource[]> {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            halClientOptions.headers.forEach((value, key) => {
                xhr.setRequestHeader(key, value);
            })
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    if (this.status === 204 || !xhr.responseText) {
                        resolve(new ResourceImpl({}, xhr.getAllResponseHeaders()));
                        return;
                    }
                    const obj = JSON.parse(xhr.responseText);
                    if (Array.isArray(obj)) {
                        resolve(obj.map(item => new ResourceImpl(item, xhr.getAllResponseHeaders())));
                        return;
                    } else {
                        resolve(new ResourceImpl(obj, xhr.getAllResponseHeaders()));
                        return;
                    }
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
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
            } else {
                xhr.send();
            }
        });
    }

}
