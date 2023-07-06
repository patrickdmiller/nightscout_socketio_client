/// <reference types="node" />
import { EventEmitter } from 'events';
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
