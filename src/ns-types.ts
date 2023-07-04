export enum NSDataFlag {
  "SGVS" = 'sgvs',
  "MBGS" = 'mbgs',
  'TREATMENTS' = 'treatments',
}

//const instead of Enum because this maps the integers from NS to the direction
export const SGVDirections = {
  0: 'FLAT',
  1: 'FortyFiveUp',
  2: 'FortyFiveDown',
  3: 'SingleUp',
  4: 'SingleDown',
  5: 'DoubleUp',
  6: 'DoubleDown'
} as const;

type SGVDirectionValues = typeof SGVDirections[keyof typeof SGVDirections];

//we parse the string date
export interface SGV {
  _id: string;
  mgdl: number;
  mills: number;
  device: string;
  direction: SGVDirectionValues
  date: Date;
}

//raw data coming from nightscout
export interface SGVRaw extends Omit<SGV, 'date'> {
  date: string,
  type: 'sgv'
}



export type MBGSRaw = {
  _id: string;
  mgdl: number;
  mills: number;
  device: string;
  type: 'mbg';
}

export interface MBGS extends MBGSRaw {
  date: Date;
}

/*
 'Correction Bolus': 1,
  'Temp Basal': 1,
  Note: 1,
  'Carb Correction': 1,
  'Suspend Pump': 1
  */
export type TreatmentRaw = {
  _id: string;

}
export interface TreatmentCorrectionBolusRaw extends TreatmentRaw {


}
export type TreatmentCarbCorrectionRaw = {}
export interface TreatmentTempBasalRaw extends TreatmentRaw {

  amount: number,
  duration: number
  absolute: 0,
  enteredBy: string,
  eventType: 'Temp Basal',
  insulinType: string,
  timestamp: '2023-06-07T09:20:07Z',
  syncIdentifier: '74656d70426173616c20302e3020323032332d30362d30375430393a32303a30375a',
  rate: 0,
  automatic: true,
  temp: 'absolute',
  created_at: '2023-06-07T09:20:07.000Z',
  utcOffset: 0,
  mills: 1686129607000,
  mgdl: 98
}
}
_id: string;
timestamp: string;
temp: 'absolute',
  syncIdentifier: '74656d70426173616c20302e3020323032332d30362d30385430343a35303a30305a',
    rate: 0,
      absolute: 0,
        enteredBy: 'loop://iPhone',
          duration: 10.1631558517615,
            amount: 0,
              eventType: 'Temp Basal',
                created_at: '2023-06-08T04:50:00.000Z',
                  automatic: true,
                    insulinType: 'Humalog',
                      utcOffset: 0,
                        mills: 1686199800000,
                          mgdl: 125

{
  _id: '6481511405264c5abfc4c5d5',
    insulin: 0.1,
      unabsorbed: 0,
        created_at: '2023-06-08T03:54:59.000Z',
          automatic: true,
            eventType: 'Correction Bolus',
              timestamp: '2023-06-08T03:54:59Z',
                programmed: 0.1,
                  duration: 0.06666666666666667,
                    syncIdentifier: '626f6c757320302e3120323032332d30362d30385430333a35343a35395a',
                      insulinType: 'Humalog',
                        type: 'normal',
                          enteredBy: 'loop://iPhone',
                            utcOffset: 0,
                              mills: 1686196499000,
                                mgdl: 153
}


// food
// treatments
// dbstats
// { mbgs: 1 }
// delta
// lastUpdated
// sgvs
// devicestatus
// {}
// delta
// lastUpdated
// sgvs
// {}


/*
devicestatus
sgvs
cals
profiles
mbgs
food
treatments
dbstats
delta
lastUpdated
sgvs
*/