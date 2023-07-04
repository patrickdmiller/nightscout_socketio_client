export declare enum NSDataFlag {
    "SGVS" = "sgvs",
    "MBGS" = "mbgs",
    'TREATMENTS' = "treatments"
}
export declare const SGVDirections: {
    readonly 0: "FLAT";
    readonly 1: "FortyFiveUp";
    readonly 2: "FortyFiveDown";
    readonly 3: "SingleUp";
    readonly 4: "SingleDown";
    readonly 5: "DoubleUp";
    readonly 6: "DoubleDown";
};
type SGVDirectionValues = typeof SGVDirections[keyof typeof SGVDirections];
export interface SGV {
    _id: string;
    mgdl: number;
    mills: number;
    device: string;
    direction: SGVDirectionValues;
    date: Date;
}
export interface SGVRaw extends Omit<SGV, 'date'> {
    date: string;
    type: 'sgv';
}
export type MBGSRaw = {
    _id: string;
    mgdl: number;
    mills: number;
    device: string;
    type: 'mbg';
};
export interface MBGS extends MBGSRaw {
    date: Date;
}
export type TreatmentRaw = {
    _id: string;
};
export interface TreatmentCorrectionBolusRaw extends TreatmentRaw {
}
export type TreatmentCarbCorrectionRaw = {};
export interface TreatmentTempBasalRaw extends TreatmentRaw {
    amount: number;
    duration: number;
    absolute: 0;
    enteredBy: string;
    eventType: 'Temp Basal';
    insulinType: string;
    timestamp: '2023-06-07T09:20:07Z';
    syncIdentifier: '74656d70426173616c20302e3020323032332d30362d30375430393a32303a30375a';
    rate: 0;
    automatic: true;
    temp: 'absolute';
    created_at: '2023-06-07T09:20:07.000Z';
    utcOffset: 0;
    mills: 1686129607000;
    mgdl: 98;
}
export {};
