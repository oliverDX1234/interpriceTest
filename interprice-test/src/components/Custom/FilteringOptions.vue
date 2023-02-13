<template>
  <div class="filtering-options">
    <div class="d-md-flex">
      <div class="me-md-3 mb-3">
        <filter-button
            v-for="(currency, index) in currencies"
            :key="currency"
            :variant="activeCurrency === currency ? 'primary' : 'outline-primary'"
            :type="getType(index, currencies.length)"
            @click="changeActiveCurrency(currency)"
        >
          {{ currency }}
        </filter-button>
      </div>

      <div class="me-md-3 mb-3">
        <filter-button
            v-for="(year, index) in yearsByCurrency"
            :key="year"
            :variant="activeYears.includes(year) ? 'primary' : 'outline-primary'"
            :type="getType(index, yearsByCurrency.length)"
            @click="changeActiveYears(year)"
        >
          {{ year }}
        </filter-button>
      </div>

      <div>
        <filter-button
            v-for="(type, index) in types"
            :key="type"
            :variant="activeType === type ? 'primary' : 'outline-primary'"
            :type="getType(index, types.length)"
            @click="changeActiveType(type)"
        >
          {{ type }}
        </filter-button>
      </div>
    </div>
  </div>
</template>

<script>
import filterButton from "@/components/UI/FilterButton";
import {mapGetters} from 'vuex'

export default {
  name: "FilteringOptions",
  components: {
    filterButton
  },
  props: {
    currencies: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      types: ['Spread', 'Yield', '3MLSpread']
    }
  },
  computed: {
    ...mapGetters([
      'activeCurrency',
      'activeYears',
      'activeType',
      'yearsByCurrency'
    ])
  },
  methods: {
    getType(index, length) {
      if (index === 0) {
        return "left"
      } else if (index === length - 1) {
        return "right"
      } else {
        return "central"
      }
    },
    changeActiveCurrency(value) {
      this.$emit("currency-updated", value)

      this.$store.dispatch("changeCurrency", value)
    },
    changeActiveYears(value) {
      this.$store.dispatch("changeYears", value)
    },
    changeActiveType(value) {
      this.$store.dispatch('setType', value)
    }
  }
}
</script>
