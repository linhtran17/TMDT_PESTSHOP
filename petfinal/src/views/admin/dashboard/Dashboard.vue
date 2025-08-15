<template>
  <div class="main-wrap">
    <div class="mb-3 d-flex justify-content-between">
      <div class="h3">{{ route.meta.title }}</div>
    </div>

    <div class="dashboard">
      <main class="content">
        <!-- Phần thống kê trạng thái đơn hàng -->
        <section class="overview">
          <div class="container-fluid">
            <div class="row">
              <h3 class="mb-2 fw-bold">Trạng thái đơn hàng</h3>
            </div>
            <div class="row">
              <div
                class="col-lg-3 col-md-4 col-6 p-2"
                v-for="st in STATICSTICS"
                :key="st.key"
              >
                <div
                  class="small-box p-4 rounded shadow my-card"
                  :class="st.className"
                >
                  <div class="inner">
                    <div class="d-flex align-items-center">
                      <div class="icon me-3">
                        <img :src="st.img" :alt="st.title" class="img-fluid" />
                      </div>
                      <div>
                        <h3
                          class="fs-3 fw-bold"
                          :class="state.busy ? 'placeholder' : ''"
                        >
                          {{ state.data[st.key] || 0 }}
                        </h3>
                        <p
                          class="fw-bold mb-0"
                          :class="state.busy ? 'placeholder' : ''"
                        >
                          {{ st.title }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Chia đôi trang -->
        <section class="overview w-100 mt-3">
          <div class="row">
            <!-- Đơn hàng mới nhất -->
            <div class="col-lg-9 col-md-12 mb-4">
              <Orders @onReload="fetchData" :getData="dashboardApi.latestOrders" />
            </div>

            <!-- Biểu đồ tròn (Pie Chart) -->
            <div class="col-lg-3 col-md-12 d-flex flex-column">
              <div class="pie-chart">
                <h3 class="mb-2 fw-bold">Biểu đồ đơn hàng</h3>

                <!-- Sử dụng biểu đồ tròn (Pie Chart) -->
                <Pie :data="chartData" :options="chartOptions" v-if="!state.busy" />
              </div>

              <!-- Chú thích -->
              <div class="chart-legend ms-4 mt-3">
                <ul class="list-unstyled">
                  <li
                    v-for="(label, index) in chartData.labels"
                    :key="index"
                    class="mb-2 d-flex align-items-center"
                  >
                    <span
                      :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"
                      class="legend-color me-2"
                    ></span>
                    <span>{{ label }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, reactive } from "vue";
import Orders from "./Orders.vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import dashboardApi from "@/api/dashboard.api";

// Đăng ký các thành phần của chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const STATICSTICS = [
  {
    key: "created",
    title: "Đơn mới",
    img: "/images/shopping-bag.png",
    className: "bg-info text-light",
  },
  {
    key: "pending",
    title: "Đơn đang xử lý",
    img: "/images/commercial.png",
    className: "bg-success text-light",
  },
  {
    key: "deliveried",
    title: "Đã giao thành công",
    img: "/images/delivery-status.png",
    className: "bg-warning text-dark",
  },
  {
    key: "cancel",
    title: "Đơn huỷ",
    img: "/images/delete-product.png",
    className: "bg-danger text-light",
  },
];

const route = useRoute();

const state = reactive({
  data: {},
  busy: true, // Trạng thái khi đang tải dữ liệu
  isBusyDetail: true,
});

const chartData = reactive({
  labels: ["Đơn mới", "Đơn đang xử lý", "Đã giao thành công", "Đơn huỷ"],
  datasets: [
    {
      data: [0, 0, 0, 0], // Dữ liệu mặc định khi chưa có dữ liệu
      backgroundColor: ["#17a2b8", "#28a745", "#ffc107", "#dc3545"],
      hoverBackgroundColor: ["#0c5460", "#218838", "#e0a800", "#c82333"],
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: false, // Ẩn chú thích trong biểu đồ
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || "";
          if (context.raw !== undefined) {
            label += ": " + context.raw + "%";
          }
          return label;
        },
      },
    },
  },
};

// Hàm lấy dữ liệu và cập nhật vào biểu đồ
const fetchData = async () => {
  const data = await dashboardApi.quantityStatistics(); // Lấy dữ liệu từ API
  if (data) {
    state.busy = false; // Cập nhật trạng thái không bận
    state.data = data; // Cập nhật dữ liệu trong state
    // Cập nhật dữ liệu cho biểu đồ
    chartData.datasets[0].data = [
      data.created || 0,     // Đơn mới
      data.pending || 0,     // Đơn đang xử lý
      data.deliveried || 0,  // Đã giao thành công
      data.cancel || 0,      // Đơn huỷ
    ];
  }
};

// Gọi hàm fetchData khi component được mount
onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
.pie-chart {
  width: 100%;
  height: 250px; /* Giảm kích thước biểu đồ */
  max-width: 350px;
  margin-bottom: 20px; /* Thêm khoảng cách dưới biểu đồ để tránh chồng chéo với chú thích */
}

.chart-legend {
  width: 100%;
  max-width: 200px;
  margin-top: 20px; /* Thêm khoảng cách phía trên của chú thích */
}

.legend-color {
  width: 15px;
  height: 15px;
  display: inline-block;
  border-radius: 50%;
}

@media (max-width: 1200px) {
  .pie-chart {
    height: 220px;
  }

  .chart-legend {
    margin-top: 50px;
  }
}

@media (max-width: 767px) {
  .overview {
    flex-direction: column;
    gap: 10px;
  }

  .pie-chart {
    height: 200px;
  }

  .chart-legend {
    margin-top: 20px;
  }
}

.dashboard {
  .overview {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .small-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .small-box:hover {
    transform: scale(1.05);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  }

  .my-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  .icon img {
    max-width: 40px;
    max-height: 40px;
  }

  .inner h3 {
    font-size: 1.5rem;
  }

  .inner p {
    font-size: 1rem;
  }

  .container-fluid {
    padding: 10px;
  }
}
</style>
