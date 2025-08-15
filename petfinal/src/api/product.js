import baseApi from './base';

export default {
  pets: async (params) => {
    const { data } = await baseApi.get("/products?" + (params || ""));
    return data || []
},
pet: async (id) => {
    const { data } = await baseApi.get("/products/" + id);
    return data
},
ourPet: async () => {
    const { data } = await baseApi.get("/our-pet");
    return data || []
},
hots: async () => {
    const { data } = await baseApi.get("/hots");
    return data || []
},
add: async (pet) => {
    const { data } = await baseApi.post("/products", pet);
    return data
},
edit: async (id, pet) => {
  const { data } = await baseApi.put(`/products/${id}`, pet); // Sửa từ update thành put
  return data;
},
delete: async (id) => {
    const { data } = await baseApi.delete("/products/" + id);
    return data
},
  uploadImage(formData) {
    const file = formData.get('file');
    console.log('Dữ liệu FormData trước khi gửi:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    });
    return baseApi.post("/media/upload", formData).then(res => res.data); // Sửa: baseApi.post
  },
  async addProduct(formData) {
    try {
      const imageResponse = await this.uploadImage(formData);
      const picture = imageResponse.filename;

      const pet = {
        name: formData.get('name'),
        picture: picture,
        cat_pro: formData.get('cat_pro'),
        cat_pet: formData.get('cat_pet'),
        price: formData.get('price'),
        discount: formData.get('discount') || 0,
        sale: formData.get('sale') || 0,
        description: formData.get('description') || '',
      };

      const newProduct = await this.add(pet);
      console.log('Sản phẩm đã được thêm:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error.message);
      throw error;
    }
  },
};