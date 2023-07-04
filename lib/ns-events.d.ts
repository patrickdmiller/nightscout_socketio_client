export type SGVRaw = {
    _id: string;
    mgdl: number;
    mills: number;
    device: string;
    direction: 'Flat' | 'FortyFiveUp' | 'FortyFiveDown' | 'SingleUp' | 'SingleDown' | 'DoubleUp' | 'DoubleDown';
    type: 'sgv';
};
export interface SGV extends SGVRaw {
    date: Date;
}
