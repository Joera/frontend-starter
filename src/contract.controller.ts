import { ethers, Signer } from 'ethers'; 
import { listenerCount } from 'process';
import { IPFSController } from './ipfs.controller';

export class ContractController {

    contract;

    constructor(address: string, abi: string, signer: Signer) {

        this.contract = new ethers.Contract(address, abi, signer);
    }

    async subscribe(cid: string,name: string) {

        const txOptions = { gasLimit: ethers.utils.hexlify(500000), gasPrice: ethers.utils.parseUnits('6', "gwei") }
        
        if (!await this.contract.exists(name)) {

            let tx = await this.contract.functions.create(cid, name, txOptions);
            this.listen();
            return tx;

        } else {

            // exists .. you want to update 
            let o = await this.contract.isOwner(name);
            if(o) {
                let tx = await this.contract.functions.update(cid, name, txOptions);
                return tx;
            }

        }
    }


    listen() {

        const report = async (event:any) => {

            console.log('Subscribed');
            console.log(event);
        }
        this.contract.on('Subscribed',report);
    }

    report() {

        console.log("kip")
    }
    


}