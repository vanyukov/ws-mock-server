/**
 * console.log
 * @param {string} param
 */
export const doLog = (...param) => {
  console.log(`${new Date().toLocaleString()}: `, ...param);
};
