import fs from "fs";
import path from "path";
import { doLog } from "./doLog.js";

/**
 *
 * @param {function} err - выпоняется при ошибке чтения файла
 * @param {function} nf - выпоняется если файл не найден, полечает объект ошибки
 * @param {function} cb - функция, получает содержимое файла
 * @param {string} t - подписка = папка в моках
 * @param {string} num - номер файла в папке
 */
export const findMockFile = (err, nf, cb, t, num) => {
  let filePath;
  const fileOverriddePath = path.normalize(
    `${path.resolve()}/src/mock_overrides/downloaded/${t}/${num}.json`,
  );
  if (fs.existsSync(fileOverriddePath)) {
    filePath = fileOverriddePath;
  } else {
    filePath = path.normalize(`${path.resolve()}/src/mock/${t}/${num}.json`);
  }

  if (!fs.existsSync(filePath)) {
    doLog(`file not exist ${filePath}`);
    nf && nf();
    return;
  }
  doLog(`Read file ${filePath}`);
  fs.readFile(filePath, (error, data) => {
    if (error) {
      doLog(`readFile error ${filePath}`, error);
      err && err(error);
      return;
    }
    cb && cb(data.toString());
  });
};
