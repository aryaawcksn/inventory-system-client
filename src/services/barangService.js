const API = `${baseURL}/api/barang`;

export const getAllBarang = async () => {
  const res = await fetch(API);
  return res.json();
};

export const createBarang = async (data) => {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
