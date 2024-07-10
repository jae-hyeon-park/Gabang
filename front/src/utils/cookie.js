export const setCookie = (name, value, options) => {
  const cookieOptions = options ? options : {}; 

  let cookieString = `${name}=${value};`;

  for (let optionKey in cookieOptions) {
    cookieString += ` ${optionKey}=${cookieOptions[optionKey]};`;
  }

  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName.trim() === name) {
      return cookieValue;
    }
  }
  return null;
};

export const removeCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
};

export const isCookie = (name) => {
  return document.cookie.includes(name);
};

export const getPayload = (name) => {
  const cookieValue = getCookie(name);
  if (!cookieValue) return null;
  const payload = cookieValue.split(' ')[1].split('.')[1];
  return JSON.parse(decodeURIComponent(escape(atob(payload))));
};

export const isAuth = (name) => {
  if (!isCookie(name)) {
    return false;
  }

  const payload = getPayload(name);
  return !!payload && payload.exp > new Date().getTime() / 1000;
};