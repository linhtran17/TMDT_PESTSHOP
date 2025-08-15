<template>
  <div
    class="cart-wrap offcanvas offcanvas-end"
    :class="{ show: props.show }"
    data-bs-scroll="true"
    data-bs-backdrop="static"
    tabindex="-1"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Thông tin đơn hàng</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        @click="$emit('onClose')"
      ></button>
    </div>
    <div class="offcanvas-body">
      <Loading v-if="props.busy"></Loading>
      <template v-else>
        <!-- Customer Info -->
        <div class="order-info">
          <div>
            <div>Họ và tên:</div>
            <div>{{ props.order?.fullname }}</div>
          </div>
          <div>
            <div>Số điện thoại:</div>
            <div>{{ props.order?.phone }}</div>
          </div>
          <div>
            <div>Email:</div>
            <div>{{ props.order?.email }}</div>
          </div>
          <div>
            <div>Địa chỉ:</div>
            <div>{{ props.order?.deliveryAddress }}</div>
          </div>
          <div>
            <div>Ghi chú:</div>
            <div>{{ props.order?.note }}</div>
          </div>
          <div>
            <div>Trạng thái đơn hàng:</div>
            <div class="status" :class="props.order?.status">
              {{ statusToTitle[props.order?.status] || "" }}
            </div>
          </div>
          <div>
            <div>Hình thức thanh toán:</div>
            <div>
              <span v-if="props.order?.pay === 'PAY'">
                Chuyển khoản
                <img
                  src="https://cdn3.iconfinder.com/data/icons/money-set-4/512/17-64.png"
                  alt="Chuyển khoản"
                  style="width: 20px; height: 20px; margin-left: 5px"
                />
              </span>
              <span v-else>
                Thanh toán khi nhận hàng
                <img
                  src="https://cdn4.iconfinder.com/data/icons/business-953/42/loan-64.png"
                  alt="Thanh toán khi nhận hàng"
                  style="width: 20px; height: 20px; margin-left: 5px"
                />
              </span>
            </div>
          </div>
          <div>
            <div>Trạng thái thanh toán:</div>
            <div>
              <span :class="{
                'status-paid': props.order?.payStatus === 'PAID',
                'status-unpaid': props.order?.payStatus !== 'PAID',
              }">
                {{ props.order?.payStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Cart list -->
        <div>
          <table class="table table-hover table-striped table-responsive caption-top">
            <caption class="fw-bold mt-2">Danh sách sản phẩm</caption>
            <thead>
              <tr>
                <th>#</th>
                <th style="width: 30%">Tên</th>
                <th class="text-center" style="width: 10%">Số lượng</th>
                <th class="text-center" style="width: 15%">Giảm giá</th>
                <th class="text-end" style="width: 15%">Giá</th>
                <th class="text-end" style="width: 20%">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, inx) in props.order?.products" :key="item.id">
                <td>{{ inx + 1 }}</td>
                <td>{{ item?.name }}</td>
                <td class="text-center">{{ item?.quantity }}</td>
                <td class="text-center">
                  <span v-if="item?.discount">
                    {{ item?.discount }}% (
                    {{
                      formatCurrency(
                        (item?.discount * item.quantity * item.price) / 100
                      )
                    }})
                  </span>
                </td>
                <td class="text-end">{{ formatCurrency(item?.price) }}</td>
                <td class="text-end">
                  {{
                    formatCurrency(
                      item?.price * item.quantity -
                      (item?.discount * item.quantity * item.price) / 100
                    )
                  }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-end fw-bold">Tổng tạm tính:</td>
                <td class="text-end fw-bold">
                  {{ formatCurrency(props.order?.tmpTotal) }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-end fw-bold">Giảm giá:</td>
                <td class="text-end fw-bold">
                  {{ formatCurrency(props.order?.discountTotal) }}
                </td>
              </tr>
              <tr>
                <td colspan="5" class="text-end fw-bold">Thành tiền:</td>
                <td class="text-end text-danger fw-bold">
                  {{ formatCurrency(props.order?.total) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- actions -->
        <div class="mt-3 d-flex confirm-wrap">
          <button class="btn btn-danger w-100 ml-1" @click="onConfirm">
            Hủy đơn hàng
          </button>
          <button
            class="btn btn-outline-secondary w-100 mr-1"
            @click="$emit('onClose')"
          >
            Đóng
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive } from "vue";
import dashboardApi from "@/api/dashboard.api";
import { notify } from "@kyvg/vue3-notification";
import Loading from "@/components/Loading.vue";
import { statusOptions } from "@/utils";

const props = defineProps(["show", "order", "busy"]);
const $emit = defineEmits(["onClose", "onSave"]);

const state = reactive({ busy: false });

const statusToTitle = {};
statusOptions.forEach((element) => {
  statusToTitle[element.value] = element.name;
});

async function onConfirm() {
  const { id, status } = props.order;
  state.busy = true;
  try {
    const data = await dashboardApi.update(id, { status });
    if (data.status) {
      notify({
        title: "Thông báo",
        text: "Không thể hủy đơn lúc này, hãy liên hệ lại với shop bạn nhé !",
        type: "warn",
      });
      $emit("onSave");
    } else {
      notify({
        title: "Thông báo",
        text: "Đã có lỗi xảy ra vui lòng thử lại",
        type: "success",
      });
    }
  } catch (error) {
    notify({
      title: "Thông báo",
      text: "Đã có lỗi xảy ra vui lòng thử lại",
      type: "warn",
    });
  } finally {
    state.busy = false;
  }
}
</script>

<style lang="scss" scoped>
.cart-wrap {
  .confirm-wrap {
    gap: 16px;
  }

  .order-info {
    border-bottom: 1px solid #ccc;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    div {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.5rem;
      div {
        &:first-child {
          font-weight: bold;
          min-width: 120px;
        }
        &:nth-child(2) {
          flex: 1;
        }
      }
    }
  }

  .status {
    padding: 0.25rem 1rem;
    border-radius: 5px;
    &.created {
      background: #fdfdfd;
      color: #141313;
    }
    &.pending {
      background: #198754;
      color: #ffffff;
    }
    &.delivered {
      background: #ffc107;
      color: #000000;
    }
    &.cancelled {
      background: #dc3545;
      color: #ffffff;
    }
  }

  .status-paid {
    color: white;
    font-weight: bold;
    background-color: green;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .status-unpaid {
    color: white;
    font-weight: bold;
    background-color: #fcc614;
    padding: 5px 10px;
    border-radius: 5px;
  }

  table {
    thead {
      background-color: #f8f9fa;
      th {
        font-weight: bold;
        text-align: center;
        padding: 10px;
      }
    }

    tbody {
      td {
        padding: 10px;
        vertical-align: middle;
      }
    }
  }
}
</style>
