export const isAlpha = (str) => {
  return /^[a-zA-Z]+$/.test(str);
};
export const checkContactNumber = (contact) => {
  const pattern = /^\+[0-9]{12}$/;
  return pattern.test(contact);
};
export const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
