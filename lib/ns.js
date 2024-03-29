"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NS = void 0;
require('dotenv').config({ path: require('find-config')('.env') });
const events_1 = require("events");
const NSType = require("./ns-types");
// we had to use old socket.io-client to be compatbile with nightscout, it is not typescript.
const io = require('socket.io-client');
const NS_SECRET = process.env.NS_SECRET || '';
const NS_URL = process.env.NS_URL || '';
class NS extends events_1.EventEmitter {
    constructor(url = NS_URL, secret = NS_SECRET) {
        super();
        this.url = url;
        this.secret = secret;
        if (this.url == '' || this.secret == '') {
            throw new Error('url or secret not set. This should be set as params(url, secret) or in .env as NS_SECRET and NS_URL variables');
        }
    }
    init() {
        this.socket = io(this.url);
        this.loadSocketListeners();
    }
    loadSocketListeners() {
        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.authorize();
        });
        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });
        this.socket.on('error', this.error);
        this.socket.on('dataUpdate', this.dataUpdate.bind(this));
        this.socket.on('retroUpdate', this.dataUpdate.bind(this));
    }
    authorize() {
        const auth_data = {
            client: 'web',
            secret: this.secret,
            token: null,
        };
        this.socket.emit('authorize', auth_data, (data) => {
            if (!data) {
                console.error('unable to authenticate');
            }
            else {
                this.emit('connect', data);
            }
        });
    }
    error(data) {
        console.error(data);
        this.emit('error', data);
    }
    dataUpdate(data) {
        let isHistory = false;
        if ('delta' in data) {
        }
        else {
            isHistory = true;
        }
        const events = new Map();
        // writeFile('out.json', JSON.stringify(data), () => {})
        const watchList = new Set(Object.values(NSType.NSDataFlag));
        const treatmentWatchList = new Set(Object.keys(NSType.TreatmentTypes));
        for (const key in data) {
            // key is a string, cast it to see if it is in the set safely
            if (watchList.has(key)) {
                console.log(' -- key -- ', key);
                switch (key) {
                    case NSType.NSDataFlag.sgvs:
                        const sgvs = [];
                        for (const sgv of data[key]) {
                            sgvs.push(Object.assign(Object.assign({}, sgv), { date: new Date(sgv.mills) }));
                        }
                        events.set(NSType.NSDataFlag.sgvs, sgvs);
                        break;
                    case NSType.NSDataFlag.mbgs:
                        const mbgs = [];
                        for (const mbg of data[key]) {
                            mbgs.push(Object.assign(Object.assign({}, mbg), { date: new Date(mbg.mills) }));
                        }
                        events.set(NSType.NSDataFlag.mbgs, mbgs);
                        break;
                    case NSType.NSDataFlag.treatments:
                        const treatments = [];
                        const treatmentActions = [];
                        for (const treatment of data[key]) {
                            //first check if it's of type action
                            if ('action' in treatment && treatment.action == 'remove') {
                                treatmentActions.push(treatment);
                            }
                            else {
                                if (treatmentWatchList.has(treatment.eventType)) {
                                    const dates = {};
                                    if (treatment.timestamp) {
                                        dates.timestamp = new Date(treatment.timestamp);
                                    }
                                    if (treatment.created_at) {
                                        dates.created_at = new Date(treatment.created_at);
                                    }
                                    if (treatment.userEnteredAt) {
                                        dates.userEnteredAt = new Date(treatment.userEnteredAt);
                                    }
                                    treatments.push(Object.assign(Object.assign({}, treatment), dates));
                                }
                                else {
                                    //skip
                                }
                            }
                        }
                        events.set(NSType.NSDataFlag.treatments, treatments);
                        if (treatmentActions.length > 0) {
                            events.set(NSType.NSDataFlag.treatments_removal, treatmentActions);
                        }
                        break;
                }
            }
        }
        for (const key of events.keys()) {
            const eventList = events.get(key);
            if (eventList && eventList.length > 0) {
                let emitEvent = key;
                if (isHistory) {
                    emitEvent = ('history_' + key);
                }
                this.emit(emitEvent, eventList);
            }
        }
    }
    retroUpdate(data) {
        // console.debug("retroUpdate", data);
    }
}
exports.NS = NS;
