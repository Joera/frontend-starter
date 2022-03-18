"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maintenance_controller_1 = require("../maintenance/maintenance.controller");
const maintenanceController = new maintenance_controller_1.MaintenanceController();
maintenanceController.compileStyling()
    .then((pages) => {
    process.exit(0);
})
    .catch((error) => {
    process.exit(1);
});
