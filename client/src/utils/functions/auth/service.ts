// auth.service.ts
export const getToken = (): string | null => {
  try {
    const storedUserData = localStorage.getItem('user-id');
    if (!storedUserData) return null;

    const { token } = JSON.parse(storedUserData);
    return token || null;
  } catch {
    console.error('Invalid data in localStorage for key "user-id"');
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('user-id');
};
