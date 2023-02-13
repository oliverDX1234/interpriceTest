<template>
  <div>
    <p class="mb-0">{{ title }}</p>
    <hr class="my-2">
    <div class="d-flex justify-content-between">
      <p class="text-gray table-year-header-subtitle">FIX</p>
      <p class="text-gray table-year-header-subtitle">FRN</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableYearHeader",
  props:{
    title: {
      required: true,
      type: String
    }
  }
}
</script>
