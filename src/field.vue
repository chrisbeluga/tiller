<template>

    <k-field
        v-bind:help="help"
        v-bind:label="label"
        v-bind:value="value"
        v-bind:disabled="disabled"
        v-bind:required="required"
        class="k-form-field k-tiller-field">
        <template
            v-slot:options>
            <options
                v-bind:list="list"
                v-bind:pages="pages"
                v-bind:files="files"
                v-bind:endpoints="endpoints"
                v-on:add="add">
            </options>
        </template>
        <vue-nestable
            keyProp="id"
            v-model="list"
            childrenProp="children">
            <template
                v-slot:placeholder>
                <empty>
                </empty>
            </template>
            <template
                slot-scope="{ item, index }">
                <fields
                    v-bind:item="item"
                    v-bind:list="list"
                    v-bind:key="index"
                    v-bind:index="index"
                    v-bind:pages="pages"
                    v-bind:files="files"
                    v-bind:fields="fields"
                    v-bind:fieldsets="fieldsets"
                    v-bind:endpoints="endpoints"
                    v-on:add="add"
                    v-on:remove="remove">
                </fields>
            </template>
        </vue-nestable>
    </k-field>

</template>

<script>

    import fields from './components/fields.vue'
    import options from './components/options.vue'

    export default {
        props: {
            value: {
                type: Array,
                required: true
            },
            label: {
                type: String,
                required: true,
            },
            disabled: {
                type: Boolean,
                required: false,
            },
            required: {
                type: Boolean,
                required: false,
            },
            endpoints: {
                type: Object,
                required: true,
            },
            fields: {
                type: Object,
                required: false,
            },
            fieldsets: {
                type: Object,
                required: false,
            },
            pages: {
                type: Object,
                required: true,
            },
            files: {
                type: Object,
                required: true,
            }
        },
        components: {
            fields,
            options,
        },
        data() {
            return {
                list: this.value
            }
        },
        watch: {
            list: {
                handler() {
                    this.value = this.list
                    this.$emit('input', this.value)
                },
                deep: true
            }
        },
        methods: {
            add(data) {
                data.item.map((item) => {
                    data.children.push({
                        id: this.$helper.string.random(16),
                        uuid: item.uuid,
                        link: item.link,
                        title: item.text,
                        url: item.url,
                        image: item.image,
                        fields: this.fields,
                        children: [],
                    })
                })
            },
            remove(data) {

                let test

                test = data.children.filter(item => {
                    return item.id !== data.item
                })

                test = test.map(item => {
                    if(item.children && item.children.length) {
                        item.children = this.remove({
                            item: data.item,
                            children: item.children
                        })
                    }
                    return item
                })

                return test

            }
        }
    }

</script>

<style lang="scss">

    .k-item-menu,
    .k-tiller-menu {
        .k-dropdown-content {
            margin-top: 10px;
        }
        .k-dropdown-item {
            width: 180px;
            margin-bottom: 10px;
            .k-button-text {
                opacity: 1;
                width: 100%;
                display: block;
                text-align: left;
                white-space: normal;
                .k-menu-divider {
                    width: 100%;
                    height: 1px;
                    opacity: 0.75;
                    display: flex;
                    cursor: default;
                    background: var(--color-white);
                }
                .k-menu-title {
                    opacity: 1;
                    color: #fff;
                    width: 100%;
                    display: flex;
                    margin-bottom: 4px;
                    .k-menu-icon {
                        width: 14px;
                        height: 14px;
                        margin-right: 6px;
                    }
                    &.k-menu-negative {
                        color: var(--color-red-400);
                    }
                }
                .k-menu-text {
                    opacity: 0.75;
                    font-size: .675rem;
                    line-height: 0.875rem;
                }
            }
        }
    }

    /* Status */
    .k-field-status {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: flex-end;
        .k-field-status-icon {
            width: 14px;
            height: 14px;
            margin-right: 6px;
            svg * {
                fill: var(--color-negative)!important;
            }
        }
    }

    /* Local */
    .k-field-local {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: flex-end;
        .k-field-local-icon {
            width: 14px;
            height: 14px;
            margin-right: 6px;
            svg * {
                fill: var(--color-negative)!important;
            }
        }
    }

    /* Nestable */
    .nestable {
        position: relative;
        .nestable-list {
            row-gap: 2px;
            display: grid;
            grid-auto-flow: row;
            padding: 0 0 0 24px;
            list-style-type: none;
        }
        & > .nestable-list {
            padding: 0;
        }
        .nestable-item {
            row-gap: 2px;
            display: grid;
            position: relative;
            grid-auto-flow: row;
            list-style-type: none;
            &:hover {
                .nestable-item-content {
                    .k-tiller-item {
                        .k-item-cardlet {
                            .k-item-content {
                                background: var(--color-gray-100);
                            }
                        }
                    }
                }
            }
            &:first-child,
            .nestable-item-copy:first-child {
                margin-top: 0;
            }
        }
    }
    .is-dragging .nestable-list {
        pointer-events: none;
    }
    .is-dragging * {
        opacity: 0;
    }
    .is-dragging:before {
        top: 2px;
        right: 0;
        bottom: 0;
        left: 24px;
        content: '';
        position: absolute;
        border-radius: var(--rounded);
        background: var(--color-gray-300);
        transition: all 0.3s ease-in-out;
    }
    .nestable-drag-layer {
        left: 0;
        top: 2px;
        z-index: 100;
        position: fixed;
        pointer-events: none;
    }

</style>