export const checkResponse = async (res) => {
  try {
    const data = await res.json();
    if (!res.ok) {
      console.error('Ошибка запроса:', res.status, data);
      throw new Error(data?.message || `Ошибка ${res.status}`);
    }
    return data;
  } catch (err) {
    throw new Error(err.message || `Ошибка ${res.status}`);
  }
};
