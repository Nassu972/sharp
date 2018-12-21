import filters from '../filters';
import { getEntityList } from "../../../api";

export const UPDATE = 'UPDATE';
export const SET_READY = 'SET_READY';
export const SET_SORT_ACTIVE = 'SET_SORT_ACTIVE';

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

        sortActive: false,
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
        },
        [SET_SORT_ACTIVE](state, active) {
            state.sortActive = active;
        }
    },

    getters: {
        instanceId(state) {
            return instance => instance[state.config.instanceIdAttribute || 'id'];
        },
        hasCommandAuthorization(state, getters) {
            return (command, { instance }={}) => {
                if(command.type === 'instance') {
                    return command.authorization.some(id => id === getters.instanceId(instance));
                }
                if(command.type === 'entity') {
                    return command.authorization;
                }
            }
        },
        entityCommands(state, getters) {
            return (state.config.commands || [])
                .filter(command => command.type === 'entity' && getters.hasCommandAuthorization(command));
        },

        canCreate(state) {
            return state.authorizations.create;
        },
        canReorder(state, getters) {
            return state.config.reorderable && state.authorizations.update && getters['results/count'] > 1;
        },
        canSearch(state) {
            return state.config.searchable;
        }
    },

    actions: {
        async get({ state, commit, getters, dispatch }, { entityKey, filterValues }) {
            const { page, search, sort, dir } = state.results;
            const data = await getEntityList({
                entityKey,
                page, search, sort, dir,
                filters: getters['filters/getQueryParams'](filterValues),
            });
            await dispatch('update', { data, filterValues });
            commit(SET_READY, true);
        },

        update({ commit, dispatch }, { data, filterValues }) {
            commit(UPDATE, {
                data: data.data,
                layout: data.layout,
                containers: data.containers,
                config: data.config,
                authorizations: data.authorizations,
                forms: data.forms,
            });
            return Promise.all([
                dispatch('results/setResults', data.data.items),
                dispatch('filters/update', {
                    filters: data.config.filters,
                    values: filterValues,
                }),
            ]);
        }
    }
}