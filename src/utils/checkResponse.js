export function checkResponse(res) {
  if (!res.ok) {
    throw new Error();
  }
  return res.json();
}
