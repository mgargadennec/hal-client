import { Parameters, Resource } from "./resource";
export interface ResourceClient {
    $request(method: string, rel: string, urlParams?: Parameters, body?: any, options?: Object): Promise<Resource | Resource[]>;
    $get(rel: string, urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $post(rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]>;
    $put(rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]>;
    $patch(rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]>;
    $delete(rel: string, urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $link(rel: string, links: string[], urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $unlink(rel: string, links: string[], urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $getSelf(options?: any): Promise<Resource | Resource[]>;
    $putSelf(payload: any, options?: any): Promise<Resource | Resource[]>;
    $postSelf(payload: any, options?: any): Promise<Resource | Resource[]>;
    $patchSelf(payload: any, options?: any): Promise<Resource | Resource[]>;
    $deleteSelf(urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $linkSelf(links: string[], options?: any): Promise<Resource | Resource[]>;
    $unlinkSelf(links: string[], options?: any): Promise<Resource | Resource[]>;
}
export declare class XMLHttpRequestResourceClient implements ResourceClient {
    private _resource;
    constructor(_resource: Resource);
    $delete(rel: string, urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $deleteSelf(urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $get(rel: string, urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $getSelf(options?: Object): Promise<Resource | Resource[]>;
    $link(rel: string, links: string[], urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $linkSelf(links: string[], options?: any): Promise<Resource | Resource[]>;
    $patch(rel: string, urlParams?: Parameters, body?: any | null, options?: any): Promise<Resource | Resource[]>;
    $patchSelf(payload: any, options?: any): Promise<Resource | Resource[]>;
    $post(rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]>;
    $postSelf(payload: any, options?: any): Promise<Resource | Resource[]>;
    $put(rel: string, urlParams?: Parameters, body?: any | null, options?: any): Promise<Resource | Resource[]>;
    $putSelf(payload: any, options?: any): Promise<Resource | Resource[]>;
    $request(method: string, rel: string, urlParams?: Parameters, body?: any, options?: any): Promise<Resource | Resource[]>;
    $unlink(rel: string, links: string[], urlParams?: Parameters, options?: any): Promise<Resource | Resource[]>;
    $unlinkSelf(links: string[], options?: any): Promise<Resource | Resource[]>;
    private performRequest;
}
