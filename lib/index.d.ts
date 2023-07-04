/// <reference types="node" />
import { EventEmitter } from "events";
export type NSAuth = {
    client: string;
    secret: string;
    token: string | null;
};
export declare class NS extends EventEmitter {
    socket: any;
    secret: string;
    url: string;
    constructor(url?: string, secret?: string);
    init(): void;
    loadSocketListeners(): void;
    authorize(): void;
    error(data: any): void;
    dataUpdate(data: any): void;
    retroUpdate(data: any): void;
}
