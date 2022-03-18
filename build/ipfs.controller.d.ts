export declare class IPFSController {
    node: import("ipfs-http-client/types/src/types").IPFSHTTPClient;
    constructor();
    upload(content: string): Promise<import("ipfs-core-types/src/root").AddResult>;
}
