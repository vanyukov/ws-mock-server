import { WebSocketServer } from "ws";
import { doLog } from "./utils/doLog.js";
import { sendMocks } from "./utils/sendMocks.js";
import { findMockFile } from "./utils/findMockFile.js";
import { broadcast } from "./utils/broadcast.js";

const port = process.env.PORT || 3030;
const wsServer = new WebSocketServer({ port });
const doBoadcast = process.env.DO_BROADCAST == "true";
wsServer.on("connection", onConnect);

function onConnect(wsClient) {
  doLog("Новый пользователь");

  wsClient.on("close", () => {
    doLog("Пользователь отключился");
  });

  wsClient.on("message", message => {
    try {
      const jsonMessage = JSON.parse(message);
      doLog("Запрос:", jsonMessage);
      if (!jsonMessage.t) {
        wsClient.send("не пришел тип подписки t");
        return;
      }
      // Проверка есть ли мок файлы
      findMockFile(
        () => {},
        // если нет -  пробуем транслировать с донора
        () => {
          doBoadcast && broadcast(jsonMessage, msg => wsClient.send(msg));
        },
        // если есть - отправляем
        () => {
          sendMocks(msg => wsClient.send(msg), jsonMessage);
        },
        jsonMessage.t,
        1,
      );
    } catch (error) {
      doLog("Ошибка", error);
    }
  });
}

doLog(`Сервер запущен на ${port} порту`);
