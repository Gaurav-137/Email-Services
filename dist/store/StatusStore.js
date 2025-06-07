"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusStore = void 0;
class StatusStore {
    constructor() {
        this.statusMap = new Map();
    }
    getStatus(id) {
        return this.statusMap.get(id);
    }
    setStatus(id, result) {
        this.statusMap.set(id, result);
    }
    exists(id) {
        return this.statusMap.has(id);
    }
}
exports.StatusStore = StatusStore;
