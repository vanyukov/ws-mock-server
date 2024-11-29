import fs from "fs";
import path from "path";
import { doLog } from "./doLog.js";

/**
 *
 * @param {function} err
 * @param {function} cb
 * @param {string} t - подписка = папка в моках
 * @param {string} num - номер файла в папке
 */
export const findMockFile = (err, cb, t, num) => {
  const filePath = path.normalize(
    `${path.resolve()}/src/mock/${t}/${num}.json`,
  );
  if (!fs.existsSync(filePath)) {
		doLog(`file not exist ${filePath}`);
    return;
  }
  doLog(`Read file ${filePath}`);
  fs.readFile(filePath, function (error, data) {
    if (error) {
      doLog(`readFile error ${filePath}`, error);
      err(error);
      return;
    }
    cb(data.toString());
  });
};
