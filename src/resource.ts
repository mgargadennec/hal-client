import {ResourceClient, XMLHttpRequestResourceClient} from "./resource-client";
import {Link} from "./link";
import * as uriTemplate from 'uri-templates';

export interface Resource {

    $hasLink(rel: string): boolean;

    $hasEmbedded(rel: string): boolean;

    $has(rel: string): boolean;

    $href(rel: string, parameters: Object): string[] | string | undefined;

    $link(rel: string): Link | Link[] | undefined;

    $request(): ResourceClient;

    $getEmbedded(rel: string): Resource | Resource[] | undefined;

    state(): Object;

}

export type Parameters = { [key: string]: string | { [key: string]: string } };

const nonenumerable = (target: any, propertyKey: string) => {
    let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    if (descriptor.enumerable !== false) {
        descriptor.enumerable = false;
        Object.defineProperty(target, propertyKey, descriptor)
    }
}

export class ResourceImpl implements Resource {
    private _embedded: Map<string, Resource | Resource[]>;
    private _links: Map<string, Link | Link[]>;
    private _client: ResourceClient;

    constructor(content: any) {
        this._embedded = new Map<string, Resource | Resource[]>();
        this._links = new Map<string, Link | Link[]>();
        this._client = new XMLHttpRequestResourceClient(this);

        Object.keys(content).forEach(key => {
                if (key === '_links') {
                    Object.keys(content[key]).forEach(
                        linkRelation => {
                            if (Array.isArray(content[key][linkRelation])) {
                                this._links.set(linkRelation, content[key][linkRelation].map((it: any) => it as Link))
                            } else {
                                this._links.set(linkRelation, content[key][linkRelation] as Link);
                            }
                        }
                    )
                } else if (key === '_embedded') {
                    Object.keys(content[key]).forEach(
                        embeddedRelation => {
                            if (Array.isArray(content[key][embeddedRelation])) {
                                this._embedded.set(embeddedRelation, content[key][embeddedRelation].map((it: any) => new ResourceImpl(it)))
                            } else {
                                this._embedded.set(embeddedRelation, new ResourceImpl(content[key][embeddedRelation]));
                            }
                        }
                    )
                } else {
                    Object.defineProperty(this, key, {
                        configurable: false,
                        enumerable: true,
                        writable: false,
                        value: content[key]
                    })
                }
            }
        )
        nonenumerable(this, '_links');
        nonenumerable(this, '_embedded');
        nonenumerable(this, '_client');
    }

    state(): Object {
        const state: any = {};
        Object.keys(this).forEach(key => {
            state[key] = (this as any)[key];
        })
        return state;
    }

    $has(rel: string): boolean {
        return this._embedded.has(rel) || this._links.has(rel);
    }

    $hasEmbedded(rel: string): boolean {
        return this._embedded.has(rel) && this._embedded.get(rel) != undefined;
    }

    $hasLink(rel: string): boolean {
        return this._links.has(rel) && this._links.get(rel) != undefined;
    }

    $href(rel: string, parameters: Parameters): string[] | string | undefined {
        const links: Link | Link[] | undefined = this.$link(rel);
        if (!links) return undefined;

        const callback: (link: Link) => string = link => link.templated ? this.generateUrl(link.href, parameters) : link.href;
        if (Array.isArray(links)) {
            return links.map(callback);
        }

        return callback(links);
    }

    $link(rel: string): Link | Link[] | undefined {
        if (!this.$hasLink(rel)) {
            throw new Error('Link with relation "' + rel + '" is undefined');
        }

        return this._links.get(rel);
    }

    $request(): ResourceClient {
        return this._client;
    }

    $getEmbedded(rel: string): Resource | Resource[] | undefined {
        return this._embedded.get(rel)
    }

    private generateUrl(href: string, parameters: Parameters) {
        return uriTemplate(href).fill(parameters);
    }

}
