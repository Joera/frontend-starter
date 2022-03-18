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
exports.WalletController = void 0;
const ethers_1 = require("ethers");
class WalletController {
    constructor() { }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum, "any");
            yield this.provider.send("eth_requestAccounts", []);
            this.signer = this.provider.getSigner();
        });
    }
    networkName(chainId) {
        switch (chainId) {
            case 1: return "Mainnet";
            case 4: return "Rinkeby";
            case 5: return "Goerli";
            case 10: return "Optimism";
            case 137: return "Polygon Mainnet";
        }
    }
}
exports.WalletController = WalletController;
