export class Logger {
  static log(msg: string) {
    console.log(`[LOG ${new Date().toISOString()}] ${msg}`);
  }
  static error(err: string) {
    console.error(`[ERROR ${new Date().toISOString()}] ${err}`);
  }
}