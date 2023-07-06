import { NS, NSType } from './'
console.log('Runnin Example')
const ns = new NS()
ns.init()

//sgvs reading.
ns.on(NSType.NSDataFlag.sgvs, (sgvs: NSType.SGV[]) => {
  console.log('New SVGS')
  console.log(sgvs)
})

//historic readings on start
ns.on(NSType.NSDataFlagHistory.history_sgvs, (sgvs: NSType.SGV[]) => {
  console.log('History SVGS')
  console.log(sgvs)
})

//new treatments
ns.on(NSType.NSDataFlag.treatments, (treatments: NSType.Treatment[]) => {
  console.log('New Treatments')
  console.log(treatments)
})

//historic treatments
ns.on(NSType.NSDataFlagHistory.history_treatments, (treatments: NSType.Treatment[]) => {
  console.log('History Treatment')
  console.log(treatments)
})

//an update where a previous treatment is removed by _id
ns.on(NSType.NSDataFlag.treatments_removal, (treatmentRemoval: NSType.TreatmentRemoval[]) => {
  console.log('New treatment removal', treatmentRemoval)
})

//history or new mbgs
ns.on(NSType.NSDataFlagHistory.history_mbgs, (mbgs: NSType.MBGS[]) => {
  console.log('history mbgs', mbgs)
})
