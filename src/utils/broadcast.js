import { doLog } from "./doLog.js";
import { saveMockOverrides } from "./saveMockOverrides.js";
import { wsConnection } from "./wsConnection.js";

/**
 *
 * @param {string} message - пересылаемое сообщение
 * @param {Function} send - функция отправки/возврата сообщения клиенту
 * @returns
 */
export const broadcast = (message, send) => {
  const ws = wsConnection();
  if (!ws) {
    return;
  }
  const saveBoadcast = process.env.SAVE_BROADCASTED_MESSAGES == "true";

  new Promise((resolve, reject) => {
    switch (ws.readyState) {
      // CONNECTING
      case 0:
        ws.on("open", () => {
          doLog("open broadcast " + ws.url);
          resolve();
        });
        ws.on("message", data => {
          doLog("broadcast message", JSON.parse(data));
          if (saveBoadcast) {
            saveMockOverrides(data);
          }
          send(data);
        });
        break;
      // OPEN
      case 1:
        resolve();
        break;
      // CLOSING
      case 2:
        reject("CLOSING");
        break;
      // CLOSED
      case 3:
        reject("CLOSED");
        break;
      default:
        break;
    }
  }).then(() => {
    doLog("resend message: " + message);
    ws.send(JSON.stringify(message));
  });
};
