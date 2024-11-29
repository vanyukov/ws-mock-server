import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";
import { doLog } from "./doLog.js";

export const saveMockOverrides = data => {
  const dataObj = JSON.parse(data);
  const folderPath = path.normalize(
    `${path.resolve()}/src/mock_overrides/downloaded/${dataObj.t}`,
  );
  fsExtra.ensureDirSync(folderPath);
  // получить последний файл
  const files = fs
    // Прочитать содержиоме папки
    .readdirSync(folderPath)
    // Сформировать пути
    .map(fileName => path.join(folderPath, fileName))
    // Оставить файлы
    .filter(fileName => fs.lstatSync(fileName).isFile())
    // Сортировка по названию, приводя к числу
    .sort((a, b) => +path.basename(b, path.extname(b)) - +path.basename(a, path.extname(a)));

  // Если файлов нет, значит 1-й, или берем имя последнего
  const num =
    files.length == 0
      ? 1
      : +path.basename(files[0], path.extname(files[0])) + 1;

  // Если достигнуто заданное количество сообщений, больше не записываем
  if ((+process.env.WS_DOWNLOAD_MSG_QNT || 5) < num) {
    return;
  }

  // Добавить файл
  const filePath = `${folderPath}/${num}.json`;
  fs.writeFile(filePath, data, err => {
    if (err) {
      doLog("Ошибка записи в файл: " + filePath, err);
      return;
    }
    //файл записан успешно
  });
};
