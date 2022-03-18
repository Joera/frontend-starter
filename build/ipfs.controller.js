"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPFSController = void 0;
const ipfs_http_client_1 = require("ipfs-http-client");
const cid_1 = require("multiformats/cid");
class IPFSController {
    constructor() {
        // @ts-ignore
        this.node = (0, ipfs_http_client_1.create)("http://64.227.70.116:5001");
    }
    dagPut(content) {
        return __awaiter(this, void 0, void 0, function* () {
            //  console.log(content);
            return yield this.node.dag.put(content, { storeCodec: 'dag-cbor', hashAlg: 'sha2-256' });
        });
    }
    dagGet(cid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.node.dag.get(cid_1.CID.parse(cid));
        });
    }
}
exports.IPFSController = IPFSController;
