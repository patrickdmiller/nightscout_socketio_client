"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const NSType = require("./ns-types");
console.log('Runnin Example');
const ns = new _1.NS();
ns.init();
//sgvs reading.
ns.on(NSType.NSDataFlag.sgvs, (sgvs) => {
    console.log('New SVGS');
    console.log(sgvs);
});
//new treatments
ns.on(NSType.NSDataFlag.treatments, (treatments) => {
    console.log('New Treatments');
    console.log(treatments);
});
//an update where a previous treatment is removed by _id
ns.on(NSType.NSDataFlag.treatments_removal, (treatmentRemoval) => {
    console.log('New treatment removal', treatmentRemoval);
});
