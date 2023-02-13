<template>
  <div class="container mb-5">
    <div class="row mb-2">
      <div class="col-12">
        <filtering-options :currencies="currencies" @currency-updated="currencyUpdated"></filtering-options>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-lg-4">
        <input v-model="filter" type="email" class="form-control" placeholder="Filter by company name ...">
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <data-table
            :filter="filter"
            :data="data"
        ></data-table>
      </div>
    </div>

  </div>
</template>

<script>
import filteringOptions from "@/components/Custom/FilteringOptions";
import dataTable from "@/components/Tables/DataTable";
import data from "../data/data.json"
import {mapGetters} from "vuex";
import moment from 'moment'

export default {
  name: 'FinanceWrapper',
  components: {filteringOptions, dataTable},
  data() {
    return {
      currencies: [],
      years: [],
      filter: "",
      data: {
        withQuote: [],
        withoutQuote: []
      },
      yearsByCurrency: {}
    }
  },
  computed: {
    ...mapGetters([
      'activeYears',
      'activeCurrency',
      'activeType'
    ]),
  },
  watch: {
    activeYears() {
      this.data.withQuote = []

      this.prepareArray()
    },
    activeCurrency() {
      this.data.withQuote = []

      this.prepareArray()
    },
    activeType() {
      this.data.withQuote = []

      this.prepareArray()
    }
  },
  methods: {
    prepareArray() {
      data.Items.forEach(item => {
        if (item.Quote) {
          let company = {
            "name": item.Company,
            "date": moment(item.DateSent).format("DD-MMM-YY"),
            "type": this.activeType,
            "Spread": {},
            "Yield": {},
            "3MLSpread": {}
          }

          item.Quote.filter(quoteItem => quoteItem.Currency === this.activeCurrency).forEach(x => {

            if (!company["Spread"][x.Years]) {
              company["Spread"][x.Years] = {
                "FIX": 0,
                "FRN": 0
              }
            }

            if (!company["Yield"][x.Years]) {
              company["Yield"][x.Years] = {
                "FIX": 0,
                "FRN": 0
              }
            }

            if (!company["3MLSpread"][x.Years]) {
              company["3MLSpread"][x.Years] = {
                "FIX": 0,
                "FRN": 0
              }
            }

            company["Spread"][x.Years][x.CouponType] += x["Spread"]
            company["Yield"][x.Years][x.CouponType] += x["Yield"]
            company["3MLSpread"][x.Years][x.CouponType] += x["3MLSpread"]
          })

          this.data.withQuote.push(company)
        }
      });
    },
    parseData() {

      data.Items.forEach(item => {

        if (item.Quote) {
          item.Quote.forEach(quoteItem => {
            if (!this.currencies.includes(quoteItem.Currency)) this.currencies.push(quoteItem.Currency)

            if (!this.yearsByCurrency[quoteItem.Currency]) {
              this.yearsByCurrency[quoteItem.Currency] = new Set()
            }

            this.yearsByCurrency[quoteItem.Currency].add(quoteItem.Years)
          })

        } else {
          this.data.withoutQuote.push(item.Company)
        }
      })

      //Initialize USD currency years
      this.$store.dispatch("setYears", Array.from(this.yearsByCurrency["USD"]))
    },

    currencyUpdated(value) {
      this.$store.dispatch("setYears", Array.from(this.yearsByCurrency[value]))
    }
  },
  mounted() {
    this.parseData()
  }
}
</script>
