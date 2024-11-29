import { findMockFile } from "./findMockFile.js";

export const sendMocks = (send, jsonMessage, i) => {
  const num = i || 1;
  findMockFile(
    () => {},
    text => {
      send(text);
      setTimeout(() => {
        sendMocks(send, jsonMessage, num + 1);
      }, process.env.MSG_PAUSE || 3000);
    },
    jsonMessage.t,
    num,
  );
};
