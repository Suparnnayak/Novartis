export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({}));
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

