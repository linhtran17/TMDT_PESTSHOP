<template>
    <div class="main-wrap">
      <div class="mb-3 h2">
        <div class="mb-3 d-flex justify-content-start">
          <router-link to="/admin/products" class="h3">{{ route.meta.title }}</router-link>
          <div class="px-2">/</div>
          <div class="h3">{{ state.title }}</div>
        </div>
      </div>
      
      <div>
        <div class="mb-3">
          <label for="name" class="form-label">Tên sản phẩm</label>
          <input type="text" class="form-control" id="name" placeholder="Nhập tên sản phẩm" v-model="state.pet.name" @input="validateName" />
          <div v-if="state.errors.name" class="text-danger">{{ state.errors.name }}</div>
        </div>
  
        <div class="mb-3">
          <label for="price" class="form-label">Giá:</label>
          <input type="number" class="form-control" id="price" placeholder="Nhập giá" v-model="state.pet.price" @input="validatePrice" />
          <div v-if="state.errors.price" class="text-danger">{{ state.errors.price }}</div>
        </div>
  
        <div class="mb-3">
          <label for="discount" class="form-label">Giảm giá:</label>
          <input type="number" class="form-control" id="discount" placeholder="Nhập giảm giá" v-model="state.pet.discount" @input="validateDiscount" />
          <div v-if="state.errors.discount" class="text-danger">{{ state.errors.discount }}</div>
        </div>
  
        <div class="mb-3">
          <label for="cat_pet" class="form-label">Loại thú cưng:</label>
          <select class="form-control" id="cat_pet" v-model="state.pet.cat_pet" @change="onChangePet">
            <option value="0" disabled>Chọn loại thú cưng</option>
            <option v-for="pet in state.pets" :key="pet.id" :value="pet.id">{{ pet.name }}</option>
          </select>
          <div v-if="state.errors.cat_pet" class="text-danger">{{ state.errors.cat_pet }}</div>
        </div>
  
        <div class="mb-3">
          <label for="cat_pro" class="form-label">Loại sản phẩm:</label>
          <select class="form-control" id="cat_pro" v-model="state.pet.cat_pro">
            <option value="0" disabled>Chọn loại sản phẩm</option>
            <option v-for="product in state.categories" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
          <div v-if="state.errors.cat_pro" class="text-danger">{{ state.errors.cat_pro }}</div>
        </div>
  
        <div class="mb-3">
          <label for="file" class="form-label">Tải lên hình ảnh:</label>
          <input type="file" class="form-control" id="file" accept="image/*" @change="onFileChange" />
          <div v-if="state.errors.file" class="text-danger">{{ state.errors.file }}</div>
        </div>
  
        <div class="mb-3">
          <label for="description" class="form-label">Mô tả:</label>
          <textarea class="form-control" id="description" placeholder="Nhập mô tả" v-model="state.pet.description" rows="3" @input="validateDescription"></textarea>
          <div v-if="state.errors.description" class="text-danger">{{ state.errors.description }}</div>
        </div>
  
        <div class="w-100">
          <div @click="onSave" class="btn btn-primary w-100" :disabled="state.busy">Lưu</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onBeforeMount, reactive } from "vue";
  import productApi from "@/api/product";
  import catPetApi from '@/api/cat-pet';
  import catProApi from '@/api/cat-product';
  import { useRoute, useRouter } from "vue-router";
  import { notify } from "@kyvg/vue3-notification";
  
  const route = useRoute();
  const router = useRouter();
  
  const state = reactive({
    busy: false,
    title: "Thêm mới",
    fileSelected: null,
    pet: {
      id: null,
      name: "",
      price: null,
      cat_pro: 0,
      cat_pet: 0,
      discount: 0,
      description: "",
      picture: ""
    },
    categories: [],
    pets: [],
    errors: {
      name: "",
      price: "",
      discount: "",
      cat_pet: "",
      cat_pro: "",
      file: "",
      description: ""
    }
  });
  
  function validateName() {
  state.errors.name = "";
  if (!state.pet.name) {
    state.errors.name = "Tên sản phẩm không được bỏ trống";
  } else if (state.pet.name.length > 255) {
    state.errors.name = "Tên sản phẩm không được vượt quá 255 ký tự";
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(state.pet.name)) {
    state.errors.name = "Tên sản phẩm không được chứa ký tự đặc biệt";
  }
}
  
  function validatePrice() {
    state.errors.price = "";
    if (!state.pet.price) {
      state.errors.price = "Giá không được bỏ trống";
    } else if (state.pet.price <= 0) {
      state.errors.price = "Giá phải lớn hơn 0";
    } else if (isNaN(state.pet.price)) {
      state.errors.price = "Giá phải là số hợp lệ";
    }
  }
  
  function validateDiscount() {
    state.errors.discount = "";
    if (state.pet.discount && state.pet.discount < 0) {
      state.errors.discount = "Giảm giá không được nhỏ hơn 0";
    } else if (isNaN(state.pet.discount)) {
      state.errors.discount = "Giảm giá phải là số hợp lệ";
    }
  }
  
  function validateDescription() {
    state.errors.description = "";
    if (!state.pet.description) {
      state.errors.description = "Mô tả không được bỏ trống";
    }
  }
  
  function onFileChange(event) {
    state.errors.file = "";
    const file = event.target.files[0];
    if (!file) {
      state.errors.file = "Vui lòng chọn một file ảnh";
      state.fileSelected = null;
      return;
    }
    if (!file.type.startsWith('image/')) {
      state.errors.file = "Vui lòng chọn file ảnh (PNG, JPG, ...)";
      state.fileSelected = null;
      notify({ title: "Thông báo", text: state.errors.file, type: 'warn' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      state.errors.file = "File quá lớn, tối đa 5MB";
      state.fileSelected = null;
      notify({ title: "Thông báo", text: state.errors.file, type: 'warn' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.fileSelected = file;
    };
    reader.onerror = () => {
      state.errors.file = "Không thể đọc file, vui lòng thử file khác";
      state.fileSelected = null;
      notify({ title: "Thông báo", text: state.errors.file, type: 'warn' });
    };
    reader.readAsDataURL(file);
  }
  
  const onChangePet = () => {
    state.pet.cat_pro = 0;
    fetchPros(state.pet.cat_pet);
  };
  
  const fetchPets = async () => {
    try {
      const { list } = await catPetApi.find(new URLSearchParams({ limit: 100 }));
      if (list && list.length > 0) {
        state.pets = list;
        state.pet.cat_pet = 0; // Đặt mặc định là 0 để yêu cầu người dùng chọn
        fetchPros(state.pet.cat_pet);
      }
    } catch (error) {
      notify({ title: "Thông báo", text: "Không thể tải danh sách loại thú cưng", type: 'error' });
    }
  };
  
  const fetchPros = async (cat_pet) => {
    try {
      const { list } = await catProApi.find(new URLSearchParams({ limit: 100, cat_pet }));
      if (list && list.length > 0) {
        state.categories = list;
        state.pet.cat_pro = 0; // Đặt mặc định là 0 để yêu cầu người dùng chọn
      }
    } catch (error) {
      notify({ title: "Thông báo", text: "Không thể tải danh sách loại sản phẩm", type: 'error' });
    }
  };
  
  async function onSave() {
    state.busy = true;
    validateName();
    validatePrice();
    validateDiscount();
    validateDescription();
    
    if (!state.pet.cat_pet || state.pet.cat_pet <= 0) {
      state.errors.cat_pet = "Vui lòng chọn loại thú cưng";
    } else {
      state.errors.cat_pet = "";
    }
    
    if (!state.pet.cat_pro || state.pet.cat_pro <= 0) {
      state.errors.cat_pro = "Vui lòng chọn loại sản phẩm";
    } else {
      state.errors.cat_pro = "";
    }
    
    if (!state.fileSelected && !state.pet.picture) {
      state.errors.file = "Vui lòng chọn một file ảnh";
    }
  
    if (Object.values(state.errors).some(error => error)) {
      notify({ title: "Thông báo", text: "Vui lòng kiểm tra lại các trường thông tin", type: 'warn' });
      state.busy = false;
      return;
    }
  
    try {
      if (state.fileSelected) {
        const formData = new FormData();
        formData.append('file', state.fileSelected);
        const data = await productApi.uploadImage(formData);
        if (data?.filename) {
          state.pet.picture = data.filename;
          state.fileSelected = null;
        } else {
          notify({ title: "Thông báo", text: "Upload ảnh thất bại", type: 'warn' });
          state.busy = false;
          return;
        }
      }
  
      if (route.params.id) {
        await productApi.edit(route.params.id, state.pet);
      } else {
        await productApi.add(state.pet);
      }
  
      notify({ title: "Thông báo", text: "Thao tác thành công!" });
      router.push({ name: "admin-products" });
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error.response?.data || error.message);
      notify({ title: "Thông báo", text: "Thao tác không thành công!", type: 'error' });
    } finally {
      state.busy = false;
    }
  }
  
  onBeforeMount(() => {
    state.fileSelected = null;
  
    if (route.params.id) {
      productApi.pet(route.params.id)
        .then((data) => {
          state.pet = { ...data, discount: data.discount || 0 };
          fetchPros(data.cat_pet);
          state.title = "Cập nhật";
        })
        .catch((err) => {
          console.error(err);
          notify({ title: "Thông báo", text: "Không thể tải thông tin sản phẩm", type: 'error' });
        });
    }
  
    fetchPets();
  });
  </script>
  
  <style lang="scss" scoped>
  .main-wrap {
    width: 100%;
  }
  .text-danger {
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  </style>