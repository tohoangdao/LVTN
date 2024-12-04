const init = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateKey = (length = 10) => {
  let key = "";
  let i = 0;
  while (i < length) {
    const position = Math.random() * init.length - 1;
    key += init.charAt(position);
    i++;
  }

  return key;
};

export default generateKey;
