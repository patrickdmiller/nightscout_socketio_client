"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreatmentTypes = exports.SGVDirections = exports.NSDataFlagHistory = exports.NSDataFlag = void 0;
var NSDataFlag;
(function (NSDataFlag) {
    NSDataFlag["sgvs"] = "sgvs";
    NSDataFlag["mbgs"] = "mbgs";
    NSDataFlag["treatments"] = "treatments";
    NSDataFlag["treatments_removal"] = "treatments_removal";
})(NSDataFlag = exports.NSDataFlag || (exports.NSDataFlag = {}));
var NSDataFlagHistory;
(function (NSDataFlagHistory) {
    NSDataFlagHistory["history_sgvs"] = "history_sgvs";
    NSDataFlagHistory["history_mbgs"] = "history_mbgs";
    NSDataFlagHistory["history_treatments"] = "history_treatments";
    NSDataFlagHistory["history_treatments_removal"] = "history_treatments_removal";
})(NSDataFlagHistory = exports.NSDataFlagHistory || (exports.NSDataFlagHistory = {}));
var SGVDirections;
(function (SGVDirections) {
    SGVDirections["Flat"] = "Flat";
    SGVDirections["FortyFiveUp"] = "FortyFiveUp";
    SGVDirections["FortyFiveDown"] = "FortyFiveDown";
    SGVDirections["SingleUp"] = "SingleUp";
    SGVDirections["SingleDown"] = "SingleDown";
    SGVDirections["DoubleUp"] = "DoubleUp";
    SGVDirections["DoubleDown"] = "DoubleDown";
})(SGVDirections = exports.SGVDirections || (exports.SGVDirections = {}));
var TreatmentTypes;
(function (TreatmentTypes) {
    TreatmentTypes["Correction Bolus"] = "Correction Bolus";
    TreatmentTypes["Temp Basal"] = "Temp Basal";
    TreatmentTypes["Note"] = "Note";
    TreatmentTypes["Carb Correction"] = "Carb Correction";
    TreatmentTypes["Suspend Pump"] = "Suspend Pump";
})(TreatmentTypes = exports.TreatmentTypes || (exports.TreatmentTypes = {}));
