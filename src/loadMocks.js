import WebSocket from "ws";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { doLog } from "./utils/doLog.js";
import { findMockOverridesMessages } from "./utils/findMockOverridesMessages.js";
import { saveMockOverrides } from "./utils/saveMockOverrides.js";

const address = process.env.WS_DOWNLOAD_DONOR;
if (!address) {
  doLog(`Заполните адрес подключения WS_DOWNLOAD_DONOR в .env`);
}
const ws = new WebSocket(address);

ws.on("error", doLog);

ws.on("open", function open() {
  doLog("connected " + address);
  const messages = findMockOverridesMessages();
  messages.forEach(item => {
    fs.readFile(item, function (error, data) {
      if (error) {
        doLog(`readFile error ${item}`, error);
        err(error);
        return;
      }
      const msg = JSON.parse(data);
      if (!msg.t) {
        doLog(`файл не содержит t: ${item}`);
        return;
      }
      const folderPath = path.normalize(
        `${path.resolve()}/src/mock_overrides/downloaded/${msg.t}`,
      );
      fsExtra.removeSync(folderPath);
      doLog("send", data.toString());
      ws.send(data.toString());
    });
  });
});

ws.on("close", function close() {
  doLog("disconnected");
});

ws.on("message", function message(data) {
  doLog("get message", JSON.parse(data));
  saveMockOverrides(data);
});

setTimeout(() => {
  doLog("timeout " + process.env.WS_DOWNLOAD_TIME_LOADING);
  ws.close();
}, +process.env.WS_DOWNLOAD_TIME_LOADING);
