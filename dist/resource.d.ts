import { ResourceClient } from "./resource-client";
import { Link } from "./link";
export interface Resource {
    $hasLink(rel: string): boolean;
    $hasEmbedded(rel: string): boolean;
    $has(rel: string): boolean;
    $href(rel: string, parameters: Object): string[] | string | undefined;
    $link(rel: string): Link | Link[] | undefined;
    $request(): ResourceClient;
    $getEmbedded(rel: string): Resource | Resource[] | undefined;
    state(): Object;
    headers(): Headers;
}
export declare type Parameters = {
    [key: string]: string | {
        [key: string]: string;
    };
};
export declare class ResourceImpl implements Resource {
    private _embedded;
    private _links;
    private _client;
    private _headers;
    constructor(content: any, allHeaders: string);
    state(): Object;
    headers(): Headers;
    $has(rel: string): boolean;
    $hasEmbedded(rel: string): boolean;
    $hasLink(rel: string): boolean;
    $href(rel: string, parameters: Parameters): string[] | string | undefined;
    $link(rel: string): Link | Link[] | undefined;
    $request(): ResourceClient;
    $getEmbedded(rel: string): Resource | Resource[] | undefined;
    private generateUrl;
}
