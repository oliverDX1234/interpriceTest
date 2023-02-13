<template>
  <button @click="$emit('click')" type="button" class="btn" :class="[`btn-${variant}`, `${type}-button`]">
    <slot>
    </slot>
  </button>
</template>

<script>
export default {
  name: "FilterButton",
  emits: ['click'],
  props:{
    type: {
      required: false,
      type: String,
      default: "central"
    },
    variant: {
      required: false,
      type: String,
      default: "primary"
    }
  }
}
</script>

<style scoped>
button{
  margin-right: 1px;
}
</style>
