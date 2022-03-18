import { EventFragment, Interface } from "ethers/lib/utils";
import { IPFSController } from "./ipfs.controller";
export declare class MainController {
    ipfs: IPFSController;
    constructor();
    setListeners(): void;
    parseAbi(): void;
    appendOption(ev: EventFragment, el: HTMLElement, iface: Interface): void;
    onSubmit(): Promise<any>;
    formatFormData(formData: FormData): any;
}
