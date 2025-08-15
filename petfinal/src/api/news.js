import baseApi from './base';

export default {
  news: async (params) => {
    const { data } = await baseApi.get("/news?" + (params || ""));
    return data || [];
  },
  find: async (params) => {
    const { data } = await baseApi.get("/news?" + (params || ""));
    return data || [];
  },
  getById: async (id) => {
    const { data } = await baseApi.get("/news/" + id);
    return data || {};
  },
  add: async (news) => {
    console.log('Dữ liệu gửi:', news);
    const { data } = await baseApi.post("/news", news);
    return data;
  },
  edit: async (id, news) => {
    console.log('Dữ liệu gửi:', { id, news });
    const { data } = await baseApi.put("/news/" + id, news);
    return data;
  },
  delete: async (id) => {
    const { data } = await baseApi.delete("/news/" + id);
    return data;
  },
  uploadImage: async (formData) => {
    const file = formData.get('file');
    console.log('Dữ liệu FormData trước khi gửi:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    });
    const { data } = await baseApi.post("/media/upload", formData);
    if (data?.filename) {
      return { filename: data.filename }; // Không cần replace, để nguyên đường dẫn
    }
    throw new Error('Upload ảnh thất bại');
  },
  async addNews(formData) {
    try {
      let hinhanh = '';
      if (formData.get('file')) {
        const imageResponse = await this.uploadImage(formData);
        hinhanh = imageResponse.filename;
      }

      const news = {
        tieude: formData.get('tieude'),
        noidung: formData.get('noidung'),
        hinhanh: hinhanh,
        description: formData.get('description') || '',
        published_date: formData.get('published_date'),
        status: formData.get('status'),
      };

      console.log('Dữ liệu gửi:', news);
      const newNews = await this.add(news);
      console.log('Tin tức đã được thêm:', newNews);
      return newNews;
    } catch (error) {
      console.error('Lỗi khi thêm tin tức:', error.response?.data || error.message);
      throw error;
    }
  },
};