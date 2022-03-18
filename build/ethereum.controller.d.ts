import { ethers } from 'ethers';
export declare class EthereumController {
    iface: ethers.utils.Interface;
    constructor(abiText: string);
    getIface(abiText: string): ethers.utils.Interface;
    getTopic(topicName: string): string;
}
