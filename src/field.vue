<template>

    <k-field
        v-bind:help="help"
        v-bind:label="label"
        v-bind:value="value"
        v-bind:disabled="disabled"
        v-bind:required="required"
        class="k-form-field k-tiller-field"
        v-bind:class="return_status ? 'tiller-unlocked' : 'tiller-locked'">
		<template
            v-slot:options
            v-if="return_status">
            <k-dropdown
                class="k-tiller-menu">
                <k-button
                    icon="dots"
                    v-on:click="dialog_tiller">
                </k-button>
                <k-dropdown-content
                    ref="dialog_tiller"
                    align="right">
                    <k-dropdown-item
                        v-on:click="dialog_pages">
                        <div
                            class="k-menu-title">
                            <k-icon
                                type="page"
                                class="k-menu-icon">
                            </k-icon>
                            <span>
                                Add Pages
                            </span>
                        </div>
                        <p
                            class="k-menu-text">
                            Add pages from the kirby file system
                        </p>
                    </k-dropdown-item>
                    <k-dropdown-item
                        v-on:click="dialog_files">
                        <div
                            class="k-menu-title">
                            <k-icon
                                type="file"
                                class="k-menu-icon">
                            </k-icon>
                            <span>
                                Add Files
                            </span>
                        </div>
                        <p
                            class="k-menu-text">
                            Add files from the kirby file system
                        </p>
                    </k-dropdown-item>
                    <k-dropdown-item
                        v-on:click="dialog_custom">
                        <div
                            class="k-menu-title">
                            <k-icon
                                type="bolt"
                                class="k-menu-icon">
                            </k-icon>
                            <span>
                                Add Custom
                            </span>
                        </div>
                        <p
                            class="k-menu-text">
                            Add a custom link not from the kirby file system
                        </p>
                    </k-dropdown-item>
                </k-dropdown-content>
            </k-dropdown>
		</template>
        <template
            v-else
            v-slot:options>
            <div
                class="k-field-status">
                <k-icon
                    type="lock"
                    class="k-field-status-icon">
                </k-icon>
                <k-text
                    theme="help"
                    class="k-field-status-text">
                    This field is locked for your user role
                </k-text>
            </div>
        </template>
        <vue-nestable
            cross-list
            keyProp="id"
            v-model="return_list"
            childrenProp="children">
            <k-empty
                icon="bolt"
                slot="placeholder"
                v-on:click="dialog_tiller">
                No menu items
            </k-empty>
            <template
                slot-scope="{ item, index }"
                v-bind:item="item">
                <tiller-item
                    v-bind:item="item"
                    v-bind:index="index"
                    v-bind:pages="pages"
                    v-bind:files="files"
                    v-bind:search="search"
                    v-bind:list="return_list"
                    v-bind:fieldsets="fieldsets"
                    v-bind:endpoints="endpoints"
                    v-bind:status="return_status"
                    v-on:action_remove="action_remove">
                    <template
                        v-slot:handle>
                        <vue-nestable-handle
                            v-bind:item="item">
                            <svg
                                viewBox="0 0 256 512"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M32 96C32 78.33 46.33 64 64 64C81.67 64 96 78.33 96 96C96 113.7 81.67 128 64 128C46.33 128 32 113.7 32 96zM32 256C32 238.3 46.33 224 64 224C81.67 224 96 238.3 96 256C96 273.7 81.67 288 64 288C46.33 288 32 273.7 32 256zM96 416C96 433.7 81.67 448 64 448C46.33 448 32 433.7 32 416C32 398.3 46.33 384 64 384C81.67 384 96 398.3 96 416zM160 96C160 78.33 174.3 64 192 64C209.7 64 224 78.33 224 96C224 113.7 209.7 128 192 128C174.3 128 160 113.7 160 96zM224 256C224 273.7 209.7 288 192 288C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224C209.7 224 224 238.3 224 256zM160 416C160 398.3 174.3 384 192 384C209.7 384 224 398.3 224 416C224 433.7 209.7 448 192 448C174.3 448 160 433.7 160 416z">
                                </path>
                            </svg>
                        </vue-nestable-handle>
                    </template>
                </tiller-item>
            </template>
        </vue-nestable>
        <template
            v-slot:help
            v-if="return_help">
            <k-grid
                v-if="return_status">
                <k-column
                    width="1/2">
                    <k-text
                        theme="help"
                        class="k-field-help"
                        v-html="help">
                    </k-text>
                </k-column>
            </k-grid>
        </template>
        <k-pages-dialog
            ref="dialog_pages"
            v-on:submit="action_kirby">
        </k-pages-dialog>
    	<k-files-dialog
            ref="dialog_files"
            v-on:submit="action_kirby">
        </k-files-dialog>
    </k-field>

</template>

<script>

    import tillerItem from './components/tiller-item.vue'

    export default {
        props: {
            help: {
                type: String,
                required: false,
            },
            value: {
                type: Array,
                required: true,
            },
            label: {
                type: String,
                required: true,
            },
            roles: {
                type: Object,
                required: false,
            },
            levels: {
                type: Number,
                required: false,
                default: 6,
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
            tillerItem,
        },
        data() {
            return {
                list: this.value || [],
            }
        },
        watch: {
            return_list: {
                handler() {
                    this.$emit(
                        'input',
                        this.return_list
                    )
                },
                deep: true,
                immediate: true,
            }
        },
        methods: {
            dialog_tiller() {
                this.$refs.dialog_tiller.open({
                    state: true
                })
            },
            dialog_custom() {
                this.$refs.dialog_custom.open({
                    state: true
                })
            },
            dialog_pages(data) {
                this.$refs.dialog_pages.open({
                    item: data,
                    multiple: true,
                    search: this.pages.search,
                    endpoint: this.endpoints.field + '/pages',
    				selected: this.pages.selected.map((model) => model.id)
    			})
            },
            dialog_files() {
                this.$refs.dialog_files.open({
                    multiple: true,
                    search: this.files.search,
                    endpoint: this.endpoints.field + '/files',
                    selected: this.files.selected.map((model) => model.id)
                })
            },
            action_kirby(data) {
                data.map((item) => {
                    this.return_list.push({
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
            action_remove(data) {
                return this.return_list = data.haystack.filter(item => item.id !== data.needle).map(item => {
                    if (item.children && item.children.length) {
                        item.children = this.action_remove({
                            haystack: item.children,
                            needle: data.needle
                        })
                    }
                    return item
                })
            }
        },
        computed: {
            return_list: {
                get() {
                    return this.list
                },
                set(data) {
                    this.list = data
                }
            },
            return_help() {
                return this.help 
                && this.help.length > 0
            },
            return_status() {
                if(!this.roles) return true
                return Object.keys(this.roles).filter(item => {
                    return this.roles[item]
                }).includes(this.$user.role)
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
                    margin-bottom: 8px;
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
