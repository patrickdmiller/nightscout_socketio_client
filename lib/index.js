"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const io = require("socket.io-client");
const events_1 = require("events");
const NS_SECRET = process.env.NS_SECRET || "";
const NS_URL = process.env.NS_URL || "";
const NSTypes = require("./ns-types");
class NS extends events_1.EventEmitter {
    constructor(url = NS_URL, secret = NS_SECRET) {
        super();
        this.url = url;
        this.secret = secret;
    }
    init() {
        this.socket = io(this.url);
        this.loadSocketListeners();
    }
    loadSocketListeners() {
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
        let auth_data = {
            client: "web",
            secret: this.secret,
            token: null,
        };
        this.socket.emit("authorize", auth_data, (data) => {
            if (!data) {
                console.error("unable to authenticate");
            }
            else {
                this.emit("connect", data);
            }
        });
    }
    error(data) {
        console.error(data);
        this.emit("error", data);
    }
    dataUpdate(data) {
        const events = new Map();
        let us = {};
        const watchList = new Set([NSTypes.NSDataFlag.SGVS]);
        console.log(watchList);
        for (let key in data) {
            if (watchList.has(key)) {
                switch (key) {
                    case NSTypes.NSDataFlag.SGVS:
                        const sgvs = [];
                        for (let sgv of data[key]) {
                            sgvs.push(Object.assign(Object.assign({}, sgv), { date: new Date(sgv.mills) }));
                        }
                        events.set(NSTypes.NSDataFlag.SGVS, sgvs);
                        break;
                    case NSTypes.NSDataFlag.MBGS:
                        const mbgs = [];
                        for (let mbg of data[key]) {
                            mbgs.push(Object.assign(Object.assign({}, mbg), { date: new Date(mbg.mills) }));
                        }
                        events.set(NSTypes.NSDataFlag.MBGS, mbgs);
                        break;
                }
            }
            console.log(key);
            // this.emit(key, data[key]);
            if (key == 'treatments') {
                for (let sgv of data[key]) {
                    us[sgv.eventType] = 1;
                    console.log(sgv.eventType);
                    if (sgv.eventType == 'Temp Basal') {
                        console.log(sgv);
                    }
                }
            }
        }
        console.log(us);
        // console.log(sgvs)
        for (let key of events.keys()) {
            let eventList = events.get(key);
            if (eventList && eventList.length > 0) {
                this.emit(key, eventList);
            }
        }
    }
    retroUpdate(data) {
        // console.debug("retroUpdate", data);
    }
}
exports.NS = NS;
