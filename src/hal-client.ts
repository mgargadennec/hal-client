import {Resource, ResourceImpl} from "./resource";

export function createClient(url: string): Promise<Resource> {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/hal+json, application/json');

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
