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
exports.ContractController = void 0;
const ethers_1 = require("ethers");
class ContractController {
    constructor(address, abi, signer) {
        this.contract = new ethers_1.ethers.Contract(address, abi, signer);
    }
    subscribe(cid, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const txOptions = { gasLimit: ethers_1.ethers.utils.hexlify(500000), gasPrice: ethers_1.ethers.utils.parseUnits('6', "gwei") };
            if (!(yield this.contract.exists(name))) {
                let tx = yield this.contract.functions.create(cid, name, txOptions);
                this.listen();
                return tx;
            }
            else {
                // exists .. you want to update 
                let o = yield this.contract.isOwner(name);
                if (o) {
                    let tx = yield this.contract.functions.update(cid, name, txOptions);
                    return tx;
                }
            }
        });
    }
    listen() {
        const report = (event) => __awaiter(this, void 0, void 0, function* () {
            console.log('Subscribed');
            console.log(event);
        });
        this.contract.on('Subscribed', report);
    }
    report() {
        console.log("kip");
    }
}
exports.ContractController = ContractController;
