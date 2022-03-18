import { ethers } from 'ethers'; 

export class AbiController {

    iface;

    constructor(abiText: string) {

        this.iface = new ethers.utils.Interface(abiText);
    }

    getIface(abiText: string) {

        return this.iface;
    }

    getTopic(topicName: string) {
        return this.iface.getEventTopic(topicName);
    }


    


}