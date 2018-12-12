import filters from '../filters';
import { getEntityList } from "../../../api";

export const SET_READY = 'SET_READY';
export const UPDATE = 'UPDATE';

export default {
    namespaced: true,
    modules: {
        filters
    },
    state: {
        ready: false,

        data: null,
        layout: null,
        containers: null,
        config: null,
        authorizations: null,
        forms: null,
    },

    mutations: {
        [UPDATE](state, {
            data, layout, containers, config, authorizations, forms,
        }) {
            state.data = data;
            state.layout = layout;
            state.containers = containers;
            state.config = config;
            state.authorizations = authorizations;
            state.forms = forms;
        },
        [SET_READY](state, ready) {
            state.ready = ready;
        }
    },

    actions: {
        async get(
            { state, commit, getters, dispatch },
            { entityKey, page, search, sort, dir, filterValues }
        ) {
            const data = await getEntityList({
                entityKey,
                page, search, sort, dir,
                filters: getters['filters/getQueryParams'](filterValues),
            });
            commit(UPDATE, {
                data: data.data,
                layout: data.layout,
                containers: data.containers,
                config: data.config,
                authorizations: data.authorizations,
                forms: data.forms,
            });
            await dispatch('filters/update', {
                filters: data.config.filters,
                values: filterValues
            });
            commit(SET_READY, true);
        }
    }
}