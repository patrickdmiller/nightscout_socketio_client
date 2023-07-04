import { configDotenv } from 'dotenv'
configDotenv()

const io = require("socket.io-client");
import { EventEmitter } from "events";
const NS_SECRET = process.env.NS_SECRET || "";
const NS_URL = process.env.NS_URL || "";

import * as NSTypes from "./ns-types"

export type NSAuth = {
  client: string;
  secret: string;
  token: string | null;
};


export class NS extends EventEmitter {
  socket!: any; // version 2 no types.
  secret: string;
  url: string;
  constructor(url: string = NS_URL, secret: string = NS_SECRET) {
    super();
    this.url = url;
    this.secret = secret;
  }

  init(): void {
    this.socket = io(this.url);
    this.loadSocketListeners();
  }

  loadSocketListeners(): void {
    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.authorize();
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("error", this.error);
    this.socket.on("dataUpdate", this.dataUpdate.bind(this));
    this.socket.on("retroUpdate", this.dataUpdate.bind(this));

  }

  authorize() {
    let auth_data: NSAuth = {
      client: "web",
      secret: this.secret,
      token: null,
    }

    this.socket.emit("authorize", auth_data, (data: any) => {
      if (!data) {
        console.error("unable to authenticate");
      } else {
        this.emit("connect", data);
      }
    })
  }

  error(data: any) {
    console.error(data);
    this.emit("error", data);
  }

  dataUpdate(data: any) {
    const events : Map<NSTypes.NSDataFlag, NSTypes.SGV[] | NSTypes.MBGS[]> = new Map()
  
    let us: any = {}
    const watchList = new Set([NSTypes.NSDataFlag.SGVS])
    console.log(watchList)
    for (let key in data) {
      if(watchList.has(key as NSTypes.NSDataFlag)) {
        switch(key) {
          case NSTypes.NSDataFlag.SGVS:
            const sgvs : NSTypes.SGV[] = []
            for (let sgv of data[key] as NSTypes.SGVRaw[]) {
              sgvs.push({...sgv, date: new Date(sgv.mills)} as NSTypes.SGV)
            }
            events.set(NSTypes.NSDataFlag.SGVS, sgvs)
            break;
          
          case NSTypes.NSDataFlag.MBGS:
            const mbgs : NSTypes.MBGS[] = []
            for (let mbg of data[key] as NSTypes.MBGSRaw[]) {
              mbgs.push({...mbg, date: new Date(mbg.mills)} as NSTypes.MBGS)
            }
            events.set(NSTypes.NSDataFlag.MBGS, mbgs)
            break;
          }

        }

      console.log(key)
      // this.emit(key, data[key]);

      if (key == 'treatments' ) {
        for (let sgv of data[key]) {
          us[sgv.eventType] = 1
          console.log(sgv.eventType)
          if(sgv.eventType == 'Temp Basal') {
            console.log(sgv)
          }
        }

      }
    }
    console.log(us)
    // console.log(sgvs)
    for(let key of events.keys()){
      let eventList = events.get(key as NSTypes.NSDataFlag)
      if(eventList && eventList.length > 0) {
        this.emit(key, eventList)
      }
    }
  }

  retroUpdate(data: any) {
    // console.debug("retroUpdate", data);
  }
}
