// src/utils/index.js

// ---- Options / Meta ----
export const statusOptions = [
  { value: "created",     name: "Mới đặt" },
  { value: "pending",     name: "Đang xử lý" },
  // { value: "published", name: "Đang giao" },
  { value: "deliveried",  name: "Đã giao hàng" },
  { value: "cancel",      name: "Huỷ" },
];

export const metas = {
  catPets:  { title: "Quản lý loại thú cưng" },
  product:  { title: "Quản lý sản phẩm" },
  dashboard:{ title: "Dashboard" },
  news:     { title: "Quản lý tin tức" },
  catPro:   { title: "Quản lý thương hiệu" },
  orders:   { title: "Quản lý Đơn hàng", key: "orders" },
};

// ---- Money ----
export function formatCurrency(value, locale = "vi-VN") {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
    .format(Number(value || 0));
}

export function formatVND(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

// ---- Date/Time ----
function toDate(input) {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(input, locale = "vi-VN") {
  const d = toDate(input);
  return d
    ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(d)
    : "";
}

export function formatDateTime(input, locale = "vi-VN") {
  const d = toDate(input);
  return d
    ? new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d)
    : "";
}

// (tuỳ chọn) Cho phép import default: import utils from '@/utils'
export default {
  statusOptions,
  metas,
  formatCurrency,
  formatVND,
  formatDate,
  formatDateTime,
};
