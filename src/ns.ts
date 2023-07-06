import { configDotenv } from 'dotenv'
import { writeFile } from 'fs'
import { EventEmitter } from 'events'

import * as NSTypes from './ns-types'

configDotenv()

// we had to use old socket.io-client to be compatbile with nightscout, it is not typescript.
const io = require('socket.io-client')

const NS_SECRET = process.env.NS_SECRET || ''
const NS_URL = process.env.NS_URL || ''

export class NS extends EventEmitter {
  socket!: any // version 2 no types.

  secret: string

  url: string

  constructor(url: string = NS_URL, secret: string = NS_SECRET) {
    super()
    this.url = url
    this.secret = secret
    if (this.url == '' || this.secret == '') {
      throw new Error(
        'url or secret not set. This should be set as params(url, secret) or in .env as NS_SECRET and NS_URL variables'
      )
    }
  }

  init(): void {
    this.socket = io(this.url)
    this.loadSocketListeners()
  }

  loadSocketListeners(): void {
    this.socket.on('connect', () => {
      console.log('Socket connected')
      this.authorize()
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    this.socket.on('error', this.error)
    this.socket.on('dataUpdate', this.dataUpdate.bind(this))
    this.socket.on('retroUpdate', this.dataUpdate.bind(this))
  }

  authorize() {
    const auth_data: NSTypes.NSAuth = {
      client: 'web',
      secret: this.secret,
      token: null,
    }

    this.socket.emit('authorize', auth_data, (data: any) => {
      if (!data) {
        console.error('unable to authenticate')
      } else {
        this.emit('connect', data)
      }
    })
  }

  error(data: any) {
    console.error(data)
    this.emit('error', data)
  }

  dataUpdate(data: any) {
    if ('delta' in data) {
      console.log('this is an update')
    } else {
      console.log('this is history.')
    }

    const events: Map<
      NSTypes.NSDataFlag,
      NSTypes.SGV[] | NSTypes.MBGS[] | NSTypes.Treatment[] | NSTypes.TreatmentRemoval[]
    > = new Map()
    writeFile('out.json', JSON.stringify(data), () => {})
    const watchList = new Set(Object.values(NSTypes.NSDataFlag))
    const treatmentWatchList = new Set(Object.keys(NSTypes.TreatmentTypes))
    for (const key in data) {
      // key is a string, cast it to see if it is in the set safely
      if (watchList.has(key as NSTypes.NSDataFlag)) {
        console.log(' -- key -- ', key)
        switch (key) {
          case NSTypes.NSDataFlag.sgvs:
            const sgvs: NSTypes.SGV[] = []
            for (const sgv of data[key] as NSTypes.SGVRaw[]) {
              sgvs.push({ ...sgv, date: new Date(sgv.mills) } as NSTypes.SGV)
            }
            events.set(NSTypes.NSDataFlag.sgvs, sgvs)
            break

          case NSTypes.NSDataFlag.mbgs:
            const mbgs: NSTypes.MBGS[] = []
            for (const mbg of data[key] as NSTypes.MBGSRaw[]) {
              mbgs.push({ ...mbg, date: new Date(mbg.mills) } as NSTypes.MBGS)
            }
            events.set(NSTypes.NSDataFlag.mbgs, mbgs)
            break

          case NSTypes.NSDataFlag.treatments:
            const treatments: NSTypes.Treatment[] = []
            const treatmentActions: NSTypes.TreatmentRemoval[] = []
            for (const treatment of data[key] as NSTypes.TreatmentRaw[]) {
              //first check if it's of type action
              if ('action' in treatment && treatment.action == 'remove') {
                treatmentActions.push(treatment as NSTypes.TreatmentRemoval)
              } else {
                if (treatmentWatchList.has(treatment.eventType)) {
                  const dates: Partial<NSTypes.Treatment> = {}
                  if (treatment.timestamp) {
                    dates.timestamp = new Date(treatment.timestamp)
                  }
                  if (treatment.created_at) {
                    dates.created_at = new Date(treatment.created_at)
                  }
                  if (treatment.userEnteredAt) {
                    dates.userEnteredAt = new Date(treatment.userEnteredAt)
                  }
                  treatments.push({
                    ...treatment,
                    ...dates,
                  } as NSTypes.Treatment)
                } else {
                  //skip
                }
              }
            }
            events.set(NSTypes.NSDataFlag.treatments, treatments)
            if (treatmentActions.length > 0) {
              events.set(NSTypes.NSDataFlag.treatments_removal, treatmentActions)
            }
            break
        }
      }
    }
    for (const key of events.keys()) {
      const eventList = events.get(key as NSTypes.NSDataFlag)
      if (eventList && eventList.length > 0) {
        this.emit(key, eventList)
      }
    }
  }

  retroUpdate(data: any) {
    // console.debug("retroUpdate", data);
  }
}
