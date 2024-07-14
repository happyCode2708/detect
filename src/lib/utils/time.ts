export const sleep = async (sleepTime: number = 2000): Promise<any> => {
  setTimeout(() => {
    return Promise.resolve();
  }, sleepTime);
};
