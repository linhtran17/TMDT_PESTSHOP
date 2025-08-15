import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuth } from './auth';
import { notify } from '@kyvg/vue3-notification';

const CART_ITEMS = "cart/items-v2";

// localStorage cart
const store = {
    save: products => {
        localStorage.setItem(CART_ITEMS, JSON.stringify({
            products
        }));
    },
    remove: () => {
        localStorage.removeItem(CART_ITEMS);
    },
    get: () => {
        const initData = localStorage.getItem(CART_ITEMS);
        if (initData) {
            return JSON.parse(initData);
        }
        return {
            products: []
        };
    }
};

export const useCart = defineStore('cart', {
    state: () => {
        const initData = store.get();
        return initData;
    },
    actions: {
        addCart(item) {
            const auth = useAuth();
            const router = useRouter();

            // Kiểm tra trạng thái đăng nhập
            if (!auth.isAuthenticated) {
                notify({ type: "warn", text: "Vui lòng đăng nhập để thêm vào giỏ hàng!" });
                router.push({ path: "/login" });
                return;
            }

            // Logic thêm sản phẩm vào giỏ hàng (giữ nguyên)
            let exists = false;
            for (let index = 0; index < this.products.length; index++) {
                const element = this.products[index];
                if (element.id === item.id) {
                    exists = true;
                    element.quantity += 1;
                    break;
                }
            }
            if (!exists) {
                item.quantity = 1;
                this.products.push(item);
            }

            store.save(this.products);
        },
        confirm() {
            this.products = [];
            store.remove();
        },
        updateQuantity(id, amount) {
            for (let index = 0; index < this.products.length; index++) {
                const element = this.products[index];
                if (element.id === id) {
                    element.quantity += amount;
                    if (element.quantity < 1) {
                        this.products = this.products.filter(p => p.id !== id);
                    }
                    break;
                }
            }
            store.save(this.products);
        }
    },
    getters: {
        total: state => {
            if (state.products) {
                return state.products.length;
            }
            return 0;
        },
        totalPrice: (state) => {
            let total = 0;
            state.products.forEach(element => {
                total += element.quantity * element.price;
            });
            return total;
        },
        totalDiscount: (state) => {
            let total = 0;
            state.products.forEach(element => {
                total += element.quantity * (element.price / 100 * element.discount);
            });
            return total;
        }
    }
});