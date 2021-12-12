export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  const tokens = JSON.parse(localStorage.getItem('tokens'));
  console.log('tokens', tokens.access);
  return tokens?.access?.token || null;
};

export const getProfile = () => {
  const user = getUser();
  return user?.profile || null;
};

export const getRoutes = () => {
  const user = getUser();
  return user?.routes || null;
};
