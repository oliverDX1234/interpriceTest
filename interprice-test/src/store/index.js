import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import * as types from './mutation-types'

const state = {
    activeCurrency: "USD",
    activeType: "Spread",
    activeYears: [],
    yearsByCurrency: []
}

const getters = {
    // ...
    activeCurrency: (state) => {
        return state.activeCurrency
    },
    activeYears: (state) => {
        return state.activeYears
    },

    activeType: (state) => {
        return state.activeType
    },

    yearsByCurrency: (state) => {
        return state.yearsByCurrency
    }
}

const actions = {
    changeCurrency(context, payload){
        context.commit(types.UPDATE_CURRENCY, payload)
    },

    changeYears(context, payload){
        context.commit(types.UPDATE_YEARS, payload)

        context.commit(types.SORT_YEARS)
    },

    setYears(context, payload){
        context.commit(types.SET_YEARS, payload)

        context.commit(types.SET_ALL_YEARS_ACTIVE, payload)

        context.commit(types.SORT_YEARS)
    },

    setType(context, payload){
        context.commit(types.SET_TYPE, payload)
    }
}

const mutations = {
    [types.UPDATE_CURRENCY](state, payload){
        state.activeCurrency = payload
    },

    [types.UPDATE_YEARS](state, payload){
        if (state.activeYears.includes(payload)) {
            state.activeYears = state.activeYears.filter(x => x !== payload)
        } else {
            state.activeYears.push(payload)
        }
    },

    [types.SET_YEARS](state, payload){
        state.yearsByCurrency = payload
    },

    [types.SET_TYPE](state, payload){
        state.activeType = payload
    },

    [types.SET_ALL_YEARS_ACTIVE](state, payload){
        state.activeYears = payload
    },

    [types.SORT_YEARS](state){
        state.activeYears.sort((a,b)=>a-b)
    }
}

const index = new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})

export default index
