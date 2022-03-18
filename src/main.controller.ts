
import { EventFragment, Interface } from "ethers/lib/utils";
import { AbiController } from "./abi.controller";
import { WalletController } from "./wallet.controller";
import { IPFSController } from "./ipfs.controller";
import { slugify } from "./services/slugify";
import { ContractController } from "./contract.controller";
import 'isomorphic-fetch';
import { GraphController} from "./graph.controller";

const CONTRACT_ADDRESS = "0x0a7DD5cAD0D3b962A7141B754DFb5aF2B58aA0f4";
const CONTRACT_CODE =  "bafyreie7kbhqg2pgycwsaezgy42ayohh5wu6fedtvsjbott6enmfvqzbiy";

export class MainController {

    ipfs;
    wallet: any;
    subscriptionContract: any;
    subgraph;

    constructor() {

        // this.connectWallet();
        this.wallet = new WalletController();
        this.setListeners();
        this.ipfs = new IPFSController();
        this.subgraph = new GraphController();
       
    }


    setListeners()  {

        let web3_button = <HTMLButtonElement>document.getElementById("web3-connect");

        (window as any).ethereum.on('chainChanged', () => {
            this.connect(web3_button);
        });
        (window as any).ethereum.on('accountsChanged', () => {
            this.connect(web3_button);
        });

        web3_button.addEventListener("click", async (event) => {
            this.connect(web3_button);
        })

        let abi_input = document.getElementById("abi");

        abi_input.addEventListener('input', (event) => {
            this.parseAbi(

            );
        });

        let subgraph_input = document.getElementById("subgraph");

        subgraph_input.addEventListener('input', (event) => {
            this.parseSubgraph(event);
        });

        let formElement = <HTMLFormElement>document.getElementById("subscription_form");

        formElement.addEventListener("submit", (e) => {
            e.preventDefault();  
            new FormData(formElement);
        });

        formElement.addEventListener("formdata", async (e) => {
            
            let formData = this.formatFormData(e.formData);

            formData.abi = await this.ipfs.dagPut(JSON.parse(formData.abi));

            let cid = (await this.ipfs.dagPut(formData)).toString();

            console.log(cid);

            await this.storeOnBC(cid,formData.name);
        });

    }


    parseAbi() {

        // via client aragon --> app center -- votes --> contract --> view on explorer --> read as proxy --> find implementation contract address 
        let events_wrapper_element = document.getElementById("events_wrapper");
        let abiText = (<HTMLTextAreaElement>document.getElementById("abi")).value;
        let abiCtrl = new AbiController(abiText);

        let iface = abiCtrl.getIface(abiText); 

        if(iface) {

            for (let ev of Object.values(iface.events)) {
                this.appendOption(ev, events_wrapper_element, iface);
            }

            let abi_wrapper_el = document.getElementById("abi-wrapper");
            abi_wrapper_el.classList.add("completed");
            events_wrapper_element.classList.add("visible");
        }
    }

    async parseSubgraph(e: Event) {

        let input = <HTMLInputElement>e.target;

        let contract = (<HTMLInputElement>document.getElementById("contract")).value;

        if (this.isValidUrl(input.value) && contract != "") {
            
            let data = await this.subgraph.query(input.value, contract); // await (await fetch(input)).json();

            let valid: boolean = this.subgraph.validate(data);

            if (valid) {
                (<HTMLDivElement>input.parentNode).classList.add('valid');
            } else {
                (<HTMLDivElement>input.parentNode).classList.add('invalid');
            }
        }
    }

    appendOption(ev: EventFragment, el: HTMLElement, iface: Interface) {

        let div = document.createElement('div');
        div.classList.add("field-wrapper");
        div.classList.add("half");

        let span = document.createElement('span');
        span.classList.add("checkbox");

        let option = document.createElement('input');
        option.type ="checkbox";
        option.id = slugify(ev.name);
        option.name = "topics";
        option.value = iface.getEventTopic(ev.name);

        let label = document.createElement('label');
        label.innerText = ev.name;
        label.htmlFor = slugify(ev.name);

        span.appendChild(option);
        span.appendChild(label);

        div.appendChild(span);
        
        el.appendChild(div);


    }


    async storeOnBC(cid: string, name: string)  {

        let artifact: any = (await this.ipfs.dagGet(CONTRACT_CODE)).value;

        if(this.wallet.signer) {
            // class or factory .. factory would create item on this class .. class would create contrract item on that class 
            this.subscriptionContract = new ContractController(CONTRACT_ADDRESS, artifact.abi,this.wallet.signer);
            let tx = await this.subscriptionContract.subscribe(cid,name);

            console.log(tx);

        } else {

            console.log("no wallet connected");
        }


    }

    formatFormData(formData: FormData) {

        let object: any  = {};
        formData.forEach((value, key) => {
            // Reflect.has in favor of: object.hasOwnProperty(key)
            if(!Reflect.has(object, key)){
                object[key] = value;
                return;
            }
            if(!Array.isArray(object[key])){
                object[key] = [object[key]];    
            }
            object[key].push(value);
        });

        return object;
    }

    async connect (web3_button: HTMLButtonElement) {

        let signer = await this.wallet.connect();
        let account = await this.wallet.signer.getAddress();
        let networkId = await this.wallet.signer.getChainId();
        web3_button.innerHTML = (networkId == 4) ? "Connected: ..." + account.slice(account.length - 4, account.length): "Please connect to Rinkeby";
    }

    isValidUrl(string: string) {
        let url;
        
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
      
        return url;
      }

}

let main = new MainController();