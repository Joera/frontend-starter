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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceController = void 0;
const fs_1 = __importDefault(require("fs"));
const node_sass_1 = __importDefault(require("node-sass"));
const fsPromises = fs_1.default.promises;
const distdir = "./dist";
const builddir = "./build";
class MaintenanceController {
    compileStyling() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield node_sass_1.default.renderSync({
                file: "/home/joera/Documents/chronicles/subscription-form/styling/main.scss",
                // outputStyle: 'compressed',
                // outFile: '/home/joera/Documents/chronicles/subscription-form/dist/style.css',
            });
            yield this._writeCss(result.css);
            return;
        });
    }
    _writeCss(css) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fsPromises.writeFile(distdir + "/style.css", css);
        });
    }
}
exports.MaintenanceController = MaintenanceController;
