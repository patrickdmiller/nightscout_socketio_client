export type NSAuth = {
    client: string;
    secret: string;
    token: string | null;
};
export declare enum NSDataFlag {
    'sgvs' = "sgvs",
    'mbgs' = "mbgs",
    'treatments' = "treatments",
    'treatments_removal' = "treatments_removal"
}
export declare enum SGVDirections {
    'Flat' = "Flat",
    'FortyFiveUp' = "FortyFiveUp",
    'FortyFiveDown' = "FortyFiveDown",
    'SingleUp' = "SingleUp",
    'SingleDown' = "SingleDown",
    'DoubleUp' = "DoubleUp",
    'DoubleDown' = "DoubleDown"
}
export interface SGV {
    _id: string;
    mgdl: number;
    mills: number;
    device: string;
    direction: SGVDirections;
    date: Date;
}
export interface SGVRaw extends Omit<SGV, 'date'> {
    date?: string;
    type: 'sgv';
}
export type MBGS = {
    _id: string;
    mgdl: number;
    mills: number;
    device: string;
    date: Date;
};
export interface MBGSRaw extends Omit<MBGS, 'date'> {
    date: string;
    type: 'mbgs';
}
export declare enum TreatmentTypes {
    'Correction Bolus' = "Correction Bolus",
    'Temp Basal' = "Temp Basal",
    'Note' = "Note",
    'Carb Correction' = "Carb Correction",
    'Suspend Pump' = "Suspend Pump"
}
export interface Treatment {
    _id: string;
    timestamp: Date;
    created_at: Date;
    userEnteredAt?: Date;
    utcOffset: number;
    mills: number;
    mgdl: number;
    syncIdentifier?: string;
    automatic?: boolean;
    enteredBy?: string;
    eventType: string;
}
export interface TreatmentRaw extends Omit<Treatment, 'created_at' | 'timestamp' | 'userEnteredAt'> {
    created_at?: string;
    timestamp?: string;
    userEnteredAt?: string;
}
export interface TreatmentCorrectionBolus extends Treatment {
    insulin: number;
    unabsorbed: number;
    eventType: (typeof TreatmentTypes)['Correction Bolus'];
    programmed: number;
    duration: number;
    insulinType: string;
    type: string;
}
export interface TreatmentCorrectionBolusRaw extends Omit<TreatmentCorrectionBolus, 'created_at' | 'timestamp' | 'userEnteredAt'> {
    created_at?: string;
    timestamp?: string;
    userEnteredAt?: string;
}
export interface TreatmentCarbCorrection extends Treatment {
    foodType: string;
    eventType: (typeof TreatmentTypes)['Carb Correction'];
    absorptionTime: number;
    carbs: number;
    userEnteredAt: Date;
}
export interface TreatmentCarbCorrectionRaw extends Omit<TreatmentCorrectionBolus, 'created_at' | 'timestamp' | 'userEnteredAt'> {
    created_at?: string;
    timestamp?: string;
    userEnteredAt?: string;
}
export interface TreatmentTempBasal extends Treatment {
    insulinType: string;
    rate: number;
    eventType: (typeof TreatmentTypes)['Temp Basal'];
    absolute: number;
    duration: number;
    amount: number;
    temp: 'absolute';
}
export interface TreatmentTempBasalRaw extends Omit<TreatmentTempBasal, 'created_at' | 'timestamp' | 'userEnteredAt'> {
    created_at?: string;
    timestamp?: string;
    userEnteredAt?: string;
}
export interface TreatmentRemoval {
    action: string;
    mills: number;
    _id: string;
}
