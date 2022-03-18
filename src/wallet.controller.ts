import { ethers, Signer } from 'ethers'; 

export class WalletController {

    provider: any ;
    signer: Signer;

    constructor() { }

 
    async connect() {

        this.provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");

        await this.provider.send("eth_requestAccounts", []);

        this.signer = this.provider.getSigner();
    }

    networkName(chainId : number) {

        switch (chainId) {

            case 1 : return "Mainnet";
            case 4 : return "Rinkeby";
            case 5 : return "Goerli";
            case 10 : return "Optimism";
            case 137 : return "Polygon Mainnet";
        }
    }

}