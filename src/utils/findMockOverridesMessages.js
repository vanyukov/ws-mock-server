import fs from "fs";
import path from "path";

export const findMockOverridesMessages = () => {
  const folderPath = path.normalize(
    `${path.resolve()}/src/mock_overrides/messages`,
  );

  const res = [];
  const files = fs.readdirSync(folderPath);
  for (const i in files) {
    const name = folderPath + "/" + files[i];
    if (fs.statSync(name).isFile()) {
      res.push(name);
    }
  }
  return res;
};
