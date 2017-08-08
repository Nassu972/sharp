<template>
    <div>
        <nav v-show="ready" class="SharpLeftNav SharpLeftNav--collapseable" :class="`SharpLeftNav--${state}`"
             role="navigation" aria-label="Menu Sharp" @click="collapsed && (collapsed=false)">
            <div class="SharpLeftNav__top-icon">
                <i class="fa" :class="currentIcon"></i>
            </div>
            <slot></slot>
            <div class="SharpLeftNav__collapse" @click.stop="collapsed = !collapsed">
                <a class="SharpLeftNav__collapse-link" href="#" @click.prevent>
                    <svg class="SharpLeftNav__collapse-arrow" width="8" height="12" viewBox="0 0 8 12" fill-rule="evenodd">
                        <path d="M7.5 10.6L2.8 6l4.7-4.6L6.1 0 0 6l6.1 6z"></path>
                    </svg>
                </a>
            </div>
        </nav>
        <div class="hidden-md-down" ref="testViewport"></div>
    </div>
</template>

<script>
    export default {
        name: 'SharpLeftNav',
        props: {
            categories: Array,
            current: String
        },
        data() {
            return {
                collapsed: null,
                state: 'expanded',
                ready: false
            }
        },
        watch: {
            collapsed: {
                immediate: true,
                handler(val, oldVal) {
                    this.$root.$emit('setClass', 'leftNav--collapsed', this.collapsed);
                    if(oldVal === null) {
                        return this.updateState();
                    }
                    // apply transition
                    this.state = val ? 'collapsing' : 'expanding';
                    setTimeout(this.updateState, 250);
                }
            }
        },
        computed: {
            viewportSmall() {
                let { offsetWidth, offsetHeight } = this.$refs.testViewport;
                return !offsetWidth && !offsetHeight;
            },
            allEntities() {
                return this.categories.reduce((res,category)=>[...res,...category.entities],[]);
            },
            currentIcon() {
                return this.current === 'dashboard'
                    ? 'fa-dashboard'
                    : (this.allEntities.find(e=>e.key===this.current)||{}).icon;
            }
        },
        methods: {
            updateState() {
                this.state = this.collapsed ? 'collapsed' : 'expanded';
            }
        },
        mounted() {
            this.collapsed = this.viewportSmall;
            this.$nextTick(_=>this.ready=true);
        }
    }
</script>