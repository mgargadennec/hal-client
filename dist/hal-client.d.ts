import { Resource } from "./resource";
import { HalClientOptions } from "./hal-client-options";
export declare function createClient(url: string, options?: HalClientOptions): Promise<Resource>;
