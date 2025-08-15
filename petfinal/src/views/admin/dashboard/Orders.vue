<template>
  <div class="container-fluid">
    <div class="row">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="fw-bold">{{ props.title || "Đơn hàng mới nhất" }}</h3>
      </div>
    </div>
    <div class="row">
      <table class="table table-striped table-hover shadow">
        <thead>
          <tr class="fw-bold">
            <template
              v-for="(col, inx) in TB_COLS"
              :key="`tb-header-${col.key || inx}`"
            >
              <th
                class="fw-bold"
                :class="col.clz"
                :style="{ width: col.width }"
              >
                {{ col.title }}
              </th>
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
            <tr v-for="(row, inxNo) in state.items" :key="`order-${row.id}`">
              <template
                v-for="(col, inx) in TB_COLS"
                :key="`tb-header-${col.key || inx}`"
              >
                <td v-if="col.key === 'no'" :class="col.clz">
                  {{ inxNo + 1 }}
                </td>

                <td
                  v-else-if="col.key === 'fullname'"
                  :class="col.clz"
                  style="cursor: pointer"
                  @click="onOrderDetailClose(row.id)"
                >
                  {{ row[col.key] }}
                </td>
                <td v-else-if="col.key === 'total'" :class="col.clz">
                  {{ formatCurrency(row[col.key]) }}
                </td>
                <td v-else-if="col.key === 'orderAt'" :class="col.clz">
                  {{ formatDate(row[col.key]) }}
                </td>
                <td v-else-if="col.key === 'payStatus'" :class="col.clz">
                  <span
                    :class="{
                      'status-paid': row[col.key] === '00',
                      'status-unpaid': row[col.key] !== '00',
                    }"
                  >
                    {{
                      row[col.key] === "00"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"
                    }}
                  </span>
                </td>
                <td
                  v-else-if="col.key === 'pay'"
                  :class="col.clz"
                  @click="() => onShowData(row?.payData)"
                >
                  <span v-if="row[col.key] === 'PAY'">
                    Chuyển khoản
                    <img
                      src="/src/assets/icons/debit-card.png"
                      alt="Chuyển khoản"
                      style="width: 20px; height: 20px; margin-left: 5px"
                    />
                  </span>
                  <span v-else>
                    Thanh toán khi nhận hàng
                    <img
                      src="/src/assets/icons/payment.png"
                      alt="Thanh toán khi nhận hàng"
                      style="width: 20px; height: 20px; margin-left: 5px"
                    />
                  </span>
                </td>
                <td v-else-if="col.key === 'status'" :class="col.clz">
                  <span class="my-status" :class="row.status">
                    {{ statusDic[row.status] || "" }}
                  </span>
                </td>
                <td v-else :class="col.clz" :data-title="row[col.key]">
                  {{ row[col.key] }}
                </td>
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
import { onMounted, reactive } from "vue";
import Loading from "@/components/Loading.vue";
import dashboardApi from "@/api/dashboard.api";
import OrderDetail from "./OrderDetails.vue";
import { statusOptions } from "@/utils";

const statusDic = {};
statusOptions.forEach((element) => {
  statusDic[element.value] = element.name;
});

const TB_COLS = [
  { key: "no", title: "ID", clz: "text-center", width: "40px" },
  { key: "fullname", title: "Khách hàng", clz: "text-left", width: "150px" },
  { key: "deliveryAddress", title: "Địa chỉ", clz: "text-break" },
  { key: "total", title: "Tổng tiền", clz: "text-end", width: "100px" },
  { key: "pay", title: "Hình thức thanh toán", clz: "text-center" },
  {
    key: "payStatus",
    title: "Trạng thái thanh toán",
    clz: "text-center",
    width: "150px",
  },
  { key: "orderAt", title: "Đặt lúc", clz: "text-end", width: "120px" },
  { key: "status", title: "Trạng thái", clz: "text-center", width: "130px" },
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

const onShowData = (payData) => {
  if (payData) {
    payData = JSON.parse(payData);
    let data = "";
    for (let key in payData) {
      data += `${key}: ${payData[key]}\n`;
    }
    alert(data);
  }
};

const fetchTableData = async () => {
  state.busy = true;
  const { list } = await props.getData(filters);
  await new Promise((r) => setTimeout(r, 200));
  if (list) {
    state.busy = false;
    state.items = list;
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
  &.created {
    color: white;
    font-weight: bold;
    background: #0dcaf0;
    padding: 5px 10px;
    border-radius: 5px;
  }
  &.pending {
    color: white;
    font-weight: bold;
    background: #198754;
    padding: 5px 10px;
    border-radius: 5px;
  }
  &.deliveried {
    color: white;
    font-weight: bold;
    background: #ffc107;
    padding: 5px 10px;
    border-radius: 5px;
  }
  &.cancel {
    color: white;
    font-weight: bold;
    background: #dc3545;
    padding: 5px 10px;
    border-radius: 5px;
  }
}

.table {
  table-layout: fixed;
  width: 100%;
}

.table th,
.table td {
  font-size: 14px;
  padding: 5px 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
