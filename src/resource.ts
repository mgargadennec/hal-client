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

}

export type Parameters = { [key: string]: string | { [key: string]: string } };

export class ResourceImpl implements Resource {
    protected _embeddeds: Map<string, Resource | Resource[]>;
    protected _links: Map<string, Link | Link[]>;
    protected _client: ResourceClient;

    constructor(content: any, _embeddeds: Map<string, Resource[]>, links: Map<string, Link[]>) {
        this._embeddeds = _embeddeds;
        this._links = links;
        this._client = new XMLHttpRequestResourceClient(this);

        Object.keys(content).forEach(
            key => Object.defineProperty(this, key, {
                configurable: false,
                enumerable: false,
                value: content[key]
            })
        )
    }

    $has(rel: string): boolean {
        return this._embeddeds.has(rel) || this._links.has(rel);
    }

    $hasEmbedded(rel: string): boolean {
        return this._embeddeds.has(rel) && this._embeddeds.get(rel) != undefined;
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

    $getEmbedded(rel: string): Resource | Resource[] | undefined  {
        return this._embeddeds.get(rel)
    }

    private generateUrl(href: string, parameters: Parameters) {
        return uriTemplate(href).fill(parameters);
    }

}
