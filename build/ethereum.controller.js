"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumController = void 0;
const ethers_1 = require("ethers");
class EthereumController {
    constructor(abiText) {
        this.iface = new ethers_1.ethers.utils.Interface(abiText);
    }
    getIface(abiText) {
        return this.iface;
    }
    getTopic(topicName) {
        return this.iface.getEventTopic(topicName);
    }
}
exports.EthereumController = EthereumController;