require('dotenv').config({ path: require('find-config')('.env') })
import { writeFile } from 'fs'
import { EventEmitter } from 'events'

import * as NSType from './ns-types'

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
    const auth_data: NSType.NSAuth = {
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
    let isHistory = false
    if ('delta' in data) {
    } else {
      isHistory = true
    }

    const events: Map<
      NSType.NSDataFlag,
      NSType.SGV[] | NSType.MBGS[] | NSType.Treatment[] | NSType.TreatmentRemoval[]
    > = new Map()
    // writeFile('out.json', JSON.stringify(data), () => {})
    const watchList = new Set(Object.values(NSType.NSDataFlag))
    const treatmentWatchList = new Set(Object.keys(NSType.TreatmentTypes))
    for (const key in data) {
      // key is a string, cast it to see if it is in the set safely
      if (watchList.has(key as NSType.NSDataFlag)) {
        console.log(' -- key -- ', key)
        switch (key) {
          case NSType.NSDataFlag.sgvs:
            const sgvs: NSType.SGV[] = []
            for (const sgv of data[key] as NSType.SGVRaw[]) {
              sgvs.push({ ...sgv, date: new Date(sgv.mills) } as NSType.SGV)
            }
            events.set(NSType.NSDataFlag.sgvs, sgvs)
            break

          case NSType.NSDataFlag.mbgs:
            const mbgs: NSType.MBGS[] = []
            for (const mbg of data[key] as NSType.MBGSRaw[]) {
              mbgs.push({ ...mbg, date: new Date(mbg.mills) } as NSType.MBGS)
            }
            events.set(NSType.NSDataFlag.mbgs, mbgs)
            break

          case NSType.NSDataFlag.treatments:
            const treatments: NSType.Treatment[] = []
            const treatmentActions: NSType.TreatmentRemoval[] = []
            for (const treatment of data[key] as NSType.TreatmentRaw[]) {
              //first check if it's of type action
              if ('action' in treatment && treatment.action == 'remove') {
                treatmentActions.push(treatment as NSType.TreatmentRemoval)
              } else {
                if (treatmentWatchList.has(treatment.eventType)) {
                  const dates: Partial<NSType.Treatment> = {}
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
                  } as NSType.Treatment)
                } else {
                  //skip
                }
              }
            }
            events.set(NSType.NSDataFlag.treatments, treatments)
            if (treatmentActions.length > 0) {
              events.set(NSType.NSDataFlag.treatments_removal, treatmentActions)
            }
            break
        }
      }
    }
    for (const key of events.keys()) {
      const eventList = events.get(key as NSType.NSDataFlag)
      if (eventList && eventList.length > 0) {
        let emitEvent: NSType.Events = key
        if (isHistory) {
          emitEvent = ('history_' + key) as NSType.Events
        }
        this.emit(emitEvent, eventList)
      }
    }
  }

  retroUpdate(data: any) {
    // console.debug("retroUpdate", data);
  }
}
