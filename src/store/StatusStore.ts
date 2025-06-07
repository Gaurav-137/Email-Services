import { EmailResult } from "../types/types";

export class StatusStore {
  private statusMap: Map<string, EmailResult> = new Map();

  getStatus(id: string) {
    return this.statusMap.get(id);
  }

  setStatus(id: string, result: EmailResult) {
    this.statusMap.set(id, result);
  }

  exists(id: string): boolean {
    return this.statusMap.has(id);
  }
}