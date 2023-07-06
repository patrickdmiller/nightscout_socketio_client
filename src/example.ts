import { NS } from './'
import * as NSType from './ns-types'
console.log('Runnin Example')
const ns = new NS()
ns.init()

//sgvs reading.
ns.on(NSType.NSDataFlag.sgvs, (sgvs: NSType.SGV[]) => {
  console.log('New SVGS')
  console.log(sgvs)
})

//new treatments
ns.on(NSType.NSDataFlag.treatments, (treatments: NSType.Treatment[]) => {
  console.log('New Treatments')
  console.log(treatments)
})

//an update where a previous treatment is removed by _id
ns.on(NSType.NSDataFlag.treatments_removal, (treatmentRemoval: NSType.TreatmentRemoval[]) => {
  console.log('New treatment removal', treatmentRemoval)
})
