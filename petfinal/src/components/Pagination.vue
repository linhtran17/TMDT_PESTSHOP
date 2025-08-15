<template>
  <div class="pagination-wrap mt-3">
    <div v-if="props.total">{{ props.total }} bản ghi</div>
    <nav aria-label="Page navigation example" v-if="props.totalPages > 1">
      <ul class="pagination justify-content-end mb-0">
        <li
          class="page-item"
          :class="{ disabled: props.page < 2 }"
          @click="onChangePage(props.page - 1, props.page < 2)"
        >
          <a class="page-link">Previous</a>
        </li>
        <li
          class="page-item"
          v-for="inx in props.totalPages"
          :key="`inx-${inx}`"
          :class="{ active: Number(inx) === Number(props.page) }"
          @click="onChangePage(inx)"
        >
          <a class="page-link" href="#">{{ inx }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: props.page > props.totalPages - 1 }"
          @click="
            onChangePage(props.page + 1, props.page > props.totalPages - 1)
          "
        >
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps(["page", "totalPages", "total"]);
const $emit = defineEmits("pageChange");

function onChangePage(page, isDisabled) {
  if (isDisabled) return;
  router.push({ query: { ...router.currentRoute.value.query, page } });
  $emit("pageChange", page);
}
</script>

<style lang="scss" scoped>
.pagination-wrap {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  justify-items: center;
  align-items: center;
}
</style>
