import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import { doLog } from "./utils/doLog.js";
import { findMockOverridesMessages } from "./utils/findMockOverridesMessages.js";
import { saveMockOverrides } from "./utils/saveMockOverrides.js";
import { wsConnection } from "./utils/wsConnection.js";

const ws = wsConnection();
if (!ws) {
  process.exit(1);
}

ws.on("open", () => {
  doLog("connected " + ws.url);
  const messages = findMockOverridesMessages();
  messages.forEach(item => {
    fs.readFile(item, (error, data) => {
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

ws.on("message", data => {
  doLog("get message", JSON.parse(data));
  saveMockOverrides(data);
});

setTimeout(() => {
  doLog("timeout " + process.env.WS_DOWNLOAD_TIME_LOADING);
  ws.close();
}, +process.env.WS_DOWNLOAD_TIME_LOADING);
