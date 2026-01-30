export const checkResponse = async <T = unknown>(res: Response): Promise<T> => {
  try {
    const data: unknown = await res.json();
    if (!res.ok) {
      const message = (data as { message?: string })?.message;
      console.error('Ошибка запроса:', res.status, data);
      throw new Error(message || `Ошибка ${res.status}`);
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`Ошибка запроса: ${res.status}`);
  }
};
