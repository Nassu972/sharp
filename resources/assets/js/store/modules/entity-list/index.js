import filters from '../filters';
import { getEntityList } from "../../../api";

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
        }
    },

    actions: {
        async get(
            { state, commit, getters, dispatch },
            { entityKey, page, search, sort, dir, filterValues }
        ) {
            const data = await getEntityList({
                entityKey,
                page: state.results.page,
                search: state.results.search,
                sort: state.results.sort,
                dir: state.results.dir,
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
            await Promise.all([
                dispatch('results/setResults', data.data),
                dispatch('filters/update', {
                    filters: data.config.filters,
                    values: filterValues,
                }),
            ]);
        }
    }
}