import WebSocket from "ws";
import { doLog } from "./doLog.js";

let ws = null;
export const wsConnection = () => {
  if (ws) {
    return ws;
  }
  const address = process.env.WS_DOWNLOAD_DONOR;
  if (!address) {
    doLog(`Заполните адрес подключения WS_DOWNLOAD_DONOR в .env`);
    return ws;
  }

  ws = new WebSocket(address);
  ws.on("error", doLog);
  ws.on("close", (e) => {
    doLog("disconnected", e);
  });

  return ws;
};
