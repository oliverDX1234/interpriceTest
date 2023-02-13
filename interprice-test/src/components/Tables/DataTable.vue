<template>
  <div class="datatable scrollable">
    <table class="financial-table table">
      <thead>
      <tr>
        <th></th>
        <th @click="sortBy('date')" scope="col" class="table-header">
          <div>
            Date Sent
            <span v-if="sort_by === 'date'">
            <i v-if="sort_desc" class="bi bi-caret-down-fill text-black"></i>
            <i v-else class="bi bi-caret-up-fill text-black"></i>
          </span>
            <span v-else>
            <i class="bi bi-caret-down-fill"></i>
          </span>
          </div>
        </th>
        <th @click="sortBy('company')" scope="col" class="table-header">
          Company
          <span v-if="sort_by === 'company'">
            <i v-if="sort_desc" class="bi bi-caret-down-fill text-black"></i>
            <i v-else class="bi bi-caret-up-fill text-black"></i>
          </span>
          <span v-else>
            <i class="bi bi-caret-down-fill"></i>
          </span>
        </th>
        <th v-for="year in activeYears" :key="year" scope="col">
          <table-year-header :title="year + ' YRS'"></table-year-header>
        </th>
      </tr>
      </thead>
      <tbody>

      <template v-for="(row, index) in filteredResults.withQuote">
        <tr :key="'row'+index" data-bs-toggle="collapse" :data-bs-target="'#accordion' + index"
            @click="setExtendedRows(row.name)">
          <td v-if="row.date.length" class="cursor-pointer">
            <i v-if="extendedRows === row.name" class="bi bi-chevron-right icon-bold"></i>
            <i v-else class="bi bi-chevron-down icon-bold"></i>
          </td>
          <td v-else></td>

          <td>{{ row.date }}</td>
          <td><span :class="{'fw-bold': row.date.length}">{{ row.name }}</span></td>

          <td v-for="item in activeYears" :key="item">
            <div class="d-flex justify-content-between">
            <span class="p-2"
                  :class="{'bg-yellow': showBackground(row[activeType][item], row.type, item)}">
              {{ formatValue(row[activeType][item], "FIX", row.type) }}
            </span>

              <span class="p-2">
              {{ formatValue(row[activeType][item], "FRN", row.type) }}
            </span>
            </div>

          </td>
        </tr>

        <template v-for="i in ['Spread', 'Yield', '3MLSpread'].filter(x => x!== activeType)">
          <tr ref="accordion-rows" :key="'accordion-'+index + '-' + i" class="collapse accordion-collapse"
              :id="'accordion' + index"
              data-bs-parent=".table">
            <td></td>
            <td></td>
            <td class="text-dark-gray">{{ i }}</td>
            <td v-for="item in activeYears" :key="item">
              <div class="d-flex justify-content-between">
            <span>
              {{ formatValue(row[i][item], "FIX", i) }}
            </span>

                <span>
              {{ formatValue(row[i][item], "FRN", i) }}
            </span>
              </div>
            </td>
          </tr>
        </template>

      </template>

      <tr v-for="item in filteredResults.withoutQuote" :key="item">
        <td></td>
        <td></td>
        <td class="text-gray">{{ item }}</td>
        <td v-for="item in activeYears" :key="item">
        </td>
      </tr>

      <tr>
        <td></td>
        <td></td>
        <td>Average By Spread</td>
        <td v-for="item in activeYears" :key="item">
          <div class="d-flex justify-content-between">
            <div>
              {{ getAverage(item)[0] }}
            </div>
            <div>
              {{ getAverage(item)[1] }}
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import tableYearHeader from "@/components/UI/TableYearHeader";
import {mapGetters} from "vuex";
import moment from "moment";

export default {
  name: "DataTable",
  emits: ['sort-by-changed'],
  components: {
    tableYearHeader
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    filter: {
      required: false,
      type: String,
      default: ""
    }
  },
  data() {
    return {
      sort_by: "date",
      sort_desc: true,
      extendedRows: null
    }
  },
  watch: {
    activeType() {
      this.closeCollapses()
    }
  },
  computed: {
    ...mapGetters([
      'activeYears',
      'activeCurrency',
      'activeType'
    ]),

    filteredResults() {
      let finalResults = Object.assign({}, this.data);

      finalResults.withQuote = finalResults.withQuote.sort((v1, v2) => {
        if (this.sort_by === "company" && this.sort_desc) {
          return v1.name.localeCompare(v2.name)
        } else if (this.sort_by === "company" && !this.sort_desc) {
          return -v1.name.localeCompare(v2.name)
        } else if (this.sort_by === "date" && this.sort_desc) {
          let date1 = moment(v1.date, "DD-MMM-YY")
          let date2 = moment(v2.date, "DD-MMM-YY")

          return -(date1 > date2)
        } else if (this.sort_by === "date" && !this.sort_desc) {
          let date1 = moment(v1.date, "DD-MMM-YY")
          let date2 = moment(v2.date, "DD-MMM-YY")

          return -(date1 < date2)
        }
      })

      finalResults.withoutQuote = finalResults.withoutQuote.sort((v1, v2) => {
        if (this.sort_by === "company" && this.sort_desc) {
          return v1.localeCompare(v2)
        } else if (this.sort_by === "company" && !this.sort_desc) {
          return -v1.localeCompare(v2)
        }
      })

      if (this.filter.length) {
        finalResults.withQuote = finalResults.withQuote.filter(x => x.name.toLowerCase().includes(this.filter.toLowerCase()))

        finalResults.withoutQuote = finalResults.withoutQuote.filter(x => x.toLowerCase().includes(this.filter.toLowerCase()))
      }

      return finalResults
    },

    minByCol() {

      let minByYearObj = {}

      this.filteredResults.withQuote.forEach(x => {

        for (const [key, value] of Object.entries(x[this.activeType])) {
          if (!minByYearObj[key]) {
            minByYearObj[key] = Infinity
          }

          if (value["FIX"] && value["FIX"] < minByYearObj[key]) {
            minByYearObj[key] = value["FIX"]
          }
        }
      })

      return minByYearObj
    }
  },
  methods: {
    formatValue(item, couponType, type) {
      if (!item || item[couponType] === 0) {
        return ""
      } else {
        if (type.includes("Spread")) {
          return "+" + item[couponType] + "bp"
        } else {
          return item[couponType].toFixed(3) + "%"
        }
      }
    },

    getAverage(year) {
      let avgFix = 0, avgFrn = 0
      let lenFix = 0, lenFrn = 0

      this.filteredResults.withQuote.forEach(x => {
        if (x.date) {
          if (x[this.activeType][year] && x[this.activeType][year]["FIX"] !== 0) {
            avgFix += x[this.activeType][year]["FIX"]
            lenFix++
          }

          if (x[this.activeType][year] && x[this.activeType][year]["FRN"] !== 0) {
            avgFrn += x[this.activeType][year]["FRN"]
            lenFrn++
          }
        }
      })

      if (lenFix) {
        avgFix = avgFix / lenFix
        if (this.activeType !== "Yield") {
          avgFix = "+" + avgFix.toFixed(0) + "bp"

        } else {
          avgFix = avgFix.toFixed(3) + "%"
        }

      }

      if (lenFrn) {
        avgFrn = avgFrn / lenFrn
        if (this.activeType !== "Yield") {
          avgFrn = "+" + avgFrn.toFixed(0) + "bp"

        } else {
          avgFrn = avgFrn.toFixed(3) + "%"
        }

      }

      return [avgFix ? avgFix : "", avgFrn ? avgFrn : ""]
    },

    sortBy(value) {
      this.closeCollapses()

      if (this.sort_by === value) {
        this.sort_desc = !this.sort_desc;
      } else {
        this.sort_desc = true;

        this.sort_by = value;
      }
    },

    closeCollapses() {
      this.$refs["accordion-rows"].forEach(x => x.classList.remove("show"))
    },

    setExtendedRows(name) {
      if (this.extendedRows !== name) {
        this.extendedRows = name
      } else {
        setTimeout(() => {
          this.extendedRows = null
        }, 350)
      }
    },

    showBackground(item, type, years) {

      let val = this.formatValue(item, "FIX", type);

      if (val === "") {
        return false
      }

      if (this.activeType !== "Yield") {
        val = +val.replace(/[^0-9]/g, '')
      } else {
        val = +val.replace('%', '')
      }

      return val === this.minByCol[years];
    }
  }
}
</script>
