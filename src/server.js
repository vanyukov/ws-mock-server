import { WebSocketServer } from "ws";
import { doLog } from "./utils/doLog.js";
import { sendMocks } from "./utils/sendMocks.js";

const port = process.env.PORT || 3030;
const wsServer = new WebSocketServer({ port });

wsServer.on("connection", onConnect);

function onConnect(wsClient) {
  doLog("Новый пользователь");

  wsClient.on("close", function () {
    doLog("Пользователь отключился");
  });

  wsClient.on("message", function (message) {
    try {
      const jsonMessage = JSON.parse(message);
      doLog("Запрос:", jsonMessage);
      if (!jsonMessage.t) {
        wsClient.send("не пришел тип подписки t");
        return;
      }
      sendMocks(msg => wsClient.send(msg), jsonMessage);
      // switch (jsonMessage.action) {
      //   case "ECHO":
      //     wsClient.send(jsonMessage.data);
      //     break;
      //   case "PING":
      //     setTimeout(function () {
      //       wsClient.send("PONG");
      //     }, 2000);
      //     break;
      //   default:
      //     doLog("Неизвестная команда");
      //     break;
      // }
    } catch (error) {
      doLog("Ошибка", error);
    }
  });
}

doLog(`Сервер запущен на ${port} порту`);
