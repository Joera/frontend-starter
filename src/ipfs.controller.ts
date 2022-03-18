import {create} from "ipfs-http-client";
import { CID } from 'multiformats/cid';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';

export class IPFSController {

    node;

    constructor() {

        // @ts-ignore
        this.node = create("http://64.227.70.116:5001");
    }

 

    async dagPut(content: string) {

       //  console.log(content);
        
        return await this.node.dag.put(content, { storeCodec: 'dag-cbor', hashAlg: 'sha2-256'});

    }


    async dagGet(cid: string) {

        return await this.node.dag.get(CID.parse(cid));
    }



}