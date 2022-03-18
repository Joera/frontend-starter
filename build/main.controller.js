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
exports.MainController = void 0;
const abi_controller_1 = require("./abi.controller");
const wallet_controller_1 = require("./wallet.controller");
const ipfs_controller_1 = require("./ipfs.controller");
const slugify_1 = require("./services/slugify");
const contract_controller_1 = require("./contract.controller");
require("isomorphic-fetch");
const graph_controller_1 = require("./graph.controller");
const CONTRACT_ADDRESS = "0x0a7DD5cAD0D3b962A7141B754DFb5aF2B58aA0f4";
const CONTRACT_CODE = "bafyreie7kbhqg2pgycwsaezgy42ayohh5wu6fedtvsjbott6enmfvqzbiy";
class MainController {
    constructor() {
        // this.connectWallet();
        this.wallet = new wallet_controller_1.WalletController();
        this.setListeners();
        this.ipfs = new ipfs_controller_1.IPFSController();
        this.subgraph = new graph_controller_1.GraphController();
    }
    setListeners() {
        let web3_button = document.getElementById("web3-connect");
        window.ethereum.on('chainChanged', () => {
            this.connect(web3_button);
        });
        window.ethereum.on('accountsChanged', () => {
            this.connect(web3_button);
        });
        web3_button.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
            this.connect(web3_button);
        }));
        let abi_input = document.getElementById("abi");
        abi_input.addEventListener('input', (event) => {
            this.parseAbi();
        });
        let subgraph_input = document.getElementById("subgraph");
        subgraph_input.addEventListener('input', (event) => {
            this.parseSubgraph(event);
        });
        let formElement = document.getElementById("subscription_form");
        formElement.addEventListener("submit", (e) => {
            e.preventDefault();
            new FormData(formElement);
        });
        formElement.addEventListener("formdata", (e) => __awaiter(this, void 0, void 0, function* () {
            let formData = this.formatFormData(e.formData);
            formData.abi = yield this.ipfs.dagPut(JSON.parse(formData.abi));
            let cid = (yield this.ipfs.dagPut(formData)).toString();
            console.log(cid);
            yield this.storeOnBC(cid, formData.name);
        }));
    }
    parseAbi() {
        // via client aragon --> app center -- votes --> contract --> view on explorer --> read as proxy --> find implementation contract address 
        let events_wrapper_element = document.getElementById("events_wrapper");
        let abiText = document.getElementById("abi").value;
        let abiCtrl = new abi_controller_1.AbiController(abiText);
        let iface = abiCtrl.getIface(abiText);
        if (iface) {
            for (let ev of Object.values(iface.events)) {
                this.appendOption(ev, events_wrapper_element, iface);
            }
            let abi_wrapper_el = document.getElementById("abi-wrapper");
            abi_wrapper_el.classList.add("completed");
            events_wrapper_element.classList.add("visible");
        }
    }
    parseSubgraph(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let input = e.target;
            let contract = document.getElementById("contract").value;
            if (this.isValidUrl(input.value) && contract != "") {
                let data = yield this.subgraph.query(input.value, contract); // await (await fetch(input)).json();
                let valid = this.subgraph.validate(data);
                if (valid) {
                    input.parentNode.classList.add('valid');
                }
                else {
                    input.parentNode.classList.add('invalid');
                }
            }
        });
    }
    appendOption(ev, el, iface) {
        let div = document.createElement('div');
        div.classList.add("field-wrapper");
        div.classList.add("half");
        let span = document.createElement('span');
        span.classList.add("checkbox");
        let option = document.createElement('input');
        option.type = "checkbox";
        option.id = (0, slugify_1.slugify)(ev.name);
        option.name = "topics";
        option.value = iface.getEventTopic(ev.name);
        let label = document.createElement('label');
        label.innerText = ev.name;
        label.htmlFor = (0, slugify_1.slugify)(ev.name);
        span.appendChild(option);
        span.appendChild(label);
        div.appendChild(span);
        el.appendChild(div);
    }
    storeOnBC(cid, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let artifact = (yield this.ipfs.dagGet(CONTRACT_CODE)).value;
            if (this.wallet.signer) {
                // class or factory .. factory would create item on this class .. class would create contrract item on that class 
                this.subscriptionContract = new contract_controller_1.ContractController(CONTRACT_ADDRESS, artifact.abi, this.wallet.signer);
                let tx = yield this.subscriptionContract.subscribe(cid, name);
                console.log(tx);
            }
            else {
                console.log("no wallet connected");
            }
        });
    }
    formatFormData(formData) {
        let object = {};
        formData.forEach((value, key) => {
            // Reflect.has in favor of: object.hasOwnProperty(key)
            if (!Reflect.has(object, key)) {
                object[key] = value;
                return;
            }
            if (!Array.isArray(object[key])) {
                object[key] = [object[key]];
            }
            object[key].push(value);
        });
        return object;
    }
    connect(web3_button) {
        return __awaiter(this, void 0, void 0, function* () {
            let signer = yield this.wallet.connect();
            let account = yield this.wallet.signer.getAddress();
            let networkId = yield this.wallet.signer.getChainId();
            web3_button.innerHTML = (networkId == 4) ? "Connected: ..." + account.slice(account.length - 4, account.length) : "Please connect to Rinkeby";
        });
    }
    isValidUrl(string) {
        let url;
        try {
            url = new URL(string);
        }
        catch (_) {
            return false;
        }
        return url;
    }
}
exports.MainController = MainController;
let main = new MainController();
