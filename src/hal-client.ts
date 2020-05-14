import {Resource, ResourceImpl} from "./resource";
import {halClientOptions, HalClientOptions} from "./hal-client-options";

export function createClient(url: string, options: HalClientOptions = halClientOptions): Promise<Resource> {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        options.headers.forEach((value, key) => {
            xhr.setRequestHeader(key, value);
        })

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.status === 204 || !xhr.responseText) {
                    return resolve(undefined);
                }
                const obj = JSON.parse(xhr.responseText);
                if (obj instanceof Array) {
                    throw new Error('The API root should be a single resource, not a list');
                } else {
                    resolve(new ResourceImpl(obj));
                }
            } else {
                throw new Error('The API root should be a single resource, not a list');
            }
        };
        xhr.onerror = () => {
            throw new Error('The API root should be a single resource, not a list');
        };
        xhr.send();
    });
}
