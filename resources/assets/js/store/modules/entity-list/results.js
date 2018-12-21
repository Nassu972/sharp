
export const SET_RESULTS = 'SET_RESULTS';
export const UPDATE_PARAMS = 'UPDATE_PARAMS';

export default {
    namespaced: true,

    state: {
        results: null,
        page: 0,
        search: '',
        sort: null,
        dir: null,
    },
    mutations: {
        [SET_RESULTS](state, results) {
            state.results = results;
        },
        [UPDATE_PARAMS](state, { page, search, sort, dir }) {
            state.page = page;
            state.search = search;
            state.sort = sort;
            state.dir = dir;
        }
    },
    getters: {
        count(state) {
            return (state.results || []).length;
        }
    },
    actions: {
        setResults({ commit }, results) {
            commit(SET_RESULTS, results);
        },
        updateParams({ commit }, { page, search, sort, dir }) {
            commit(UPDATE_PARAMS, { page, search, sort, dir });
        },
    }
}