<template>
  <div class="container-fluid">
    <div class="row">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- <h3 class="fw-bold">{{ props.title || "Đơn hàng mới nhất" }}</h3> -->
        <div>
          <!-- <select
            class="form-select"
            v-model="filters.status"
            @change="fetchTableData"
          >
            <option value="">Tất cả trạng thái</option>
            <option
              v-for="status in statusOptions"
              :key="status.value"
              :value="status.value"
            >
              {{ status.name }}
            </option>
          </select> -->
        </div>
      </div>
    </div>
    <div class="row">
      <table class="table table-striped table-hover shadow table-lg">
        <thead>
          <tr class="fw-bold">
            <template
              v-for="(col, inx) in TB_COLS"
              :key="`tb-header-${col.key || inx}`"
            >
              <th class="fw-bold" :class="col.clz">{{ col.title }}</th>
            </template>
          </tr>
        </thead>
        <tbody v-if="state.busy">
          <tr>
            <td colspan="8">
              <Loading></Loading>
            </td>
          </tr>
        </tbody>
        <template v-else>
          <tbody v-if="state.items && state.items.length > 0">
            <tr
              v-for="(row, inxNo) in state.items"
              :key="`order-${row.id}`"
              @click="onOrderDetailClose(row.id)"
              class="table-row-lg"
            >
              <template
                v-for="(col, inx) in TB_COLS"
                :key="`tb-header-${col.key || inx}`"
              >
                <th class="fw-bold" v-if="col.key === 'no'" :class="col.clz">
                  {{ inxNo + 1 }}
                </th>
                <td v-else-if="col.key === 'total'" :class="col.clz">
                  {{ formatCurrency(row[col.key]) }}
                </td>
                <td v-else-if="col.key === 'orderAt'" :class="col.clz">
                  {{ formatDate(row[col.key]) }}
                </td>
                <td v-else-if="col.key === 'pay'" :class="col.clz">
                  <span v-if="row[col.key] === 'PAY'">
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
                </td>
                <td v-else-if="col.key === 'payStatus'" :class="col.clz">
                  <span
                    :class="{
                      'status-paid': row[col.key] === 'PAID',
                      'status-unpaid': row[col.key] !== 'PAID',
                    }"
                  >
                  {{
                    row[col.key] === "00"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"
                  }}
                  </span>
                </td>
                <td v-else-if="col.key === 'status'" :class="col.clz">
                  <span class="my-status" :class="row.status">
                    {{ statusDic[row.status] || "" }}
                  </span>
                </td>
                <td v-else :class="col.clz">{{ row[col.key] }}</td>
              </template>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="8">
                <div class="text-center py-3 fw-bold">Không có dữ liệu</div>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <OrderDetail
      :show="!!state.id"
      @onClose="onOrderDetailClose(0)"
      :busy="state.isBusyDetail"
      :order="state.order"
      @onSave="onDetailSave"
    ></OrderDetail>
  </div>
</template>
<script setup>
import { onMounted, reactive, computed } from "vue";
import Loading from "@/components/Loading.vue";
import dashboardApi from "@/api/dashboard.api";
import OrderDetail from "./OrderDetails-shipper.vue";
import { statusOptions } from "@/utils";
import { useAuth } from "@/stores/auth";

const storeAuth = useAuth();
const user = storeAuth.user || {};

const statusDic = {};
statusOptions.forEach((element) => {
  statusDic[element.value] = element.name;
});

const TB_COLS = [
  { key: "no", title: "#", clz: "text-center" },
  { key: "fullname", title: "Khách hàng", clz: "text-left" },
  { key: "deliveryAddress", title: "Địa chỉ", clz: "text-break" },
  { key: "total", title: "Tổng tiền", clz: "text-end" },
  { key: "orderAt", title: "Đặt lúc", clz: "text-end" },
  { key: "pay", title: "Hình thức thanh toán", clz: "text-center" },
  { key: "payStatus", title: "Trạng thái thanh toán", clz: "text-center" },
  { key: "status", title: "Trạng thái", clz: "text-end" },
];

const props = defineProps(["getData", "title"]);

const state = reactive({
  busy: true,
  items: [],
  isBusyDetail: true,
  id: 0,
  order: {},
});

const filters = reactive({
  status: "",
});

const $emit = defineEmits("onReload");

const onOrderDetailClose = async (id) => {
  state.id = id;
  if (id) {
    state.isBusyDetail = true;
    const result = await dashboardApi.findOrderById(id);
    if (result) {
      state.order = result;
    }
  }
  state.isBusyDetail = false;
};

const fetchTableData = async () => {
  state.busy = true;
  const { list } = await props.getData(filters); // Truyền filters vào API
  await new Promise((r) => setTimeout(r, 200));
  if (list) {
    state.items = list.filter((order) => order.fullname === user.username); // Lọc các đơn hàng theo khách hàng
    state.busy = false;
  }
};

const onDetailSave = () => {
  state.id = 0;
  fetchTableData();
  $emit("onReload");
};

onMounted(() => {
  fetchTableData();
});
</script>
<style lang="scss" scoped>
.my-status {
  border-radius: 5px;
  &.created {
    background: #0dcaf0;
  }
  &.pending {
    background: #198754;
  }
  &.deliveried {
    background: #ffc107;
  }
  &.cancel {
    background: #dc3545;
  }
} /* Thêm các class để làm cho các ô dữ liệu lớn hơn */
.table-lg th,
.table-lg td {
  padding: 1.5rem; /* Điều chỉnh padding để làm các ô lớn hơn */
  font-size: 1.1rem; /* Điều chỉnh kích thước chữ */
}
.table-row-lg {
  height: 150px; /* Điều chỉnh chiều cao của các hàng */
  font-size: 1.1rem; /* Điều chỉnh kích thước chữ */
}
select.form-select {
  width: auto;
  min-width: 200px;
}

/* Thêm các class cho trạng thái thanh toán */
.status-paid {
  color: rgb(27, 25, 25);
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
}

.status-unpaid {
  color: rgb(15, 14, 14);
  font-weight: bold;

  padding: 5px 10px;
}
</style>