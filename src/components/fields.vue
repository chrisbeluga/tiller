<template>

    <article
        class="k-tiller-item">
        <div
            class="k-item-cardlet">
            <div
                class="k-item-handle">
                <vue-nestable-handle
                    v-bind:item="item">
                    <svg
                        viewBox="0 0 256 512"
                        xmlns="http://www.w3.org/2000/svg"
                        class="k-handle-icon">
                        <path
                            d="M32 96C32 78.33 46.33 64 64 64C81.67 64 96 78.33 96 96C96 113.7 81.67 128 64 128C46.33 128 32 113.7 32 96zM32 256C32 238.3 46.33 224 64 224C81.67 224 96 238.3 96 256C96 273.7 81.67 288 64 288C46.33 288 32 273.7 32 256zM96 416C96 433.7 81.67 448 64 448C46.33 448 32 433.7 32 416C32 398.3 46.33 384 64 384C81.67 384 96 398.3 96 416zM160 96C160 78.33 174.3 64 192 64C209.7 64 224 78.33 224 96C224 113.7 209.7 128 192 128C174.3 128 160 113.7 160 96zM224 256C224 273.7 209.7 288 192 288C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224C209.7 224 224 238.3 224 256zM160 416C160 398.3 174.3 384 192 384C209.7 384 224 398.3 224 416C224 433.7 209.7 448 192 448C174.3 448 160 433.7 160 416z">
                        </path>
                    </svg>
                </vue-nestable-handle>
            </div>
            <div
                class="k-item-content">
                <div
                    class="k-content-display"
                    v-on:click="$refs.edit.open()">
                    <k-item-image
                        v-if="item.image"
                        width="38px"
                        v-bind:image="{
                            ...item.image,
                            cover: true,
                            ratio: '2/2'
                        }">
                    </k-item-image>
                </div>
                <div
                    class="k-content-meta"
                    v-on:click="$refs.edit.open()">
                    <div
                        class="k-meta-title">
                        {{ item.title }}
                        <span
                            class="k-title-suffix"
                            v-if="item.children.length > 0">
                            ({{ item.children.length }} {{ item.children.length > 1 ? 'subpages' : 'subpage' }})
                        </span>
                    </div>
                </div>
                <div
                    class="k-content-action">
                    <k-dropdown
                        class="k-item-menu">
                        <k-button
                            icon="dots"
                            v-on:click="$refs.menu.open()">
                        </k-button>
                        <k-dropdown-content
                            ref="menu"
                            align="right">
                            <k-dropdown-item
                                v-on:click="$refs.pages.open({
                                    multiple: true,
                                    search: pages.search,
                                    endpoint: endpoints.field + '/pages',
                                    selected: pages.selected.map((model) => model.id)
                                })">
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
                                    Add pages from the Kirby file system as a child to {{ item.title }}
                                </p>
                            </k-dropdown-item>
                            <k-dropdown-item
                                v-on:click="$refs.files.open({
                                    multiple: true,
                                    search: files.search,
                                    endpoint: endpoints.field + '/files',
                                    selected: files.selected.map((model) => model.id)
                                })">
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
                                    Add files from the Kirby file system as a child to {{ item.title }}
                                </p>
                            </k-dropdown-item>
                            <k-dropdown-item>
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
                                    Add a custom link not from the Kirby file system as a child to {{ item.title }}
                                </p>
                            </k-dropdown-item>
                            <k-dropdown-item>
                                <div
                                    class="k-menu-divider">
                                </div>
                            </k-dropdown-item>
                            <k-dropdown-item
                                v-on:click="$refs.edit.open()">
                                <div
                                    class="k-menu-title">
                                    <k-icon
                                        type="edit"
                                        class="k-menu-icon">
                                    </k-icon>
                                    <span>
                                        Edit
                                    </span>
                                </div>
                                <p
                                    class="k-menu-text">
                                    Edit custom fields for {{ item.title }}
                                </p>
                            </k-dropdown-item>
                            <k-dropdown-item
                                v-on:click="$refs.remove.open()">
                                <div
                                    class="k-menu-title k-menu-negative">
                                    <k-icon
                                        type="trash"
                                        class="k-menu-icon">
                                    </k-icon>
                                    <span>
                                        Remove
                                    </span>
                                </div>
                                <p
                                    class="k-menu-text">
                                    Remove {{ item.title }} from the menu
                                </p>
                            </k-dropdown-item>
                        </k-dropdown-content>
                    </k-dropdown>
                </div>
            </div>
        </div>
        <k-drawer
            icon="bolt"
            ref="edit"
            v-bind:title="'Edit ' + item.title">
            <k-form 
                v-model="item.fields" 
                v-bind:fields="{ ...this.fieldsets }">
            </k-form>
        </k-drawer>
        <k-dialog
            ref="remove"
            icon="trash"
            theme="negative"
            submitButton="Remove"
            v-on:submit="remove">
            <k-text>
                Do you really want to remove <strong>{{ item.title }}</strong>?
            </k-text>
        </k-dialog>
        <k-pages-dialog
            ref="pages"
            v-on:submit="add">
        </k-pages-dialog>
        <k-files-dialog
            ref="files"
            v-on:submit="add">
        </k-files-dialog>
    </article>

</template>

<script>

    export default {
        name: 'fields',
        props: {
            list: {
                type: Array,
                required: true
            },
            item: {
                type: Object,
                required: true
            },
            index: {
                type: Number,
                required: true
            },
            fields: {
                type: Object,
                required: true
            },
            fieldsets: {
                type: Object,
                required: false
            },
            pages: {
                type: Object,
                required: true
            },
            files: {
                type: Object,
                required: true
            },
            endpoints: {
                type: Object,
                required: true
            },
        },
        methods: {
            add(data) {
                this.$emit('add', { 
                    item: data, 
                    children: this.item.children 
                })
            },
            remove() {
                this.$emit('remove', {
                    item: this.item.id,
                    children: this.list
                })
            }
        }
    }

</script>

<style lang="scss" scoped>

    .k-tiller-item {
        width: 100%;
        display: flex;
        position: relative;
        flex-direction: column;
        &:hover {
            .k-item-cardlet {
                .k-item-handle {
                    .k-handle-icon {
                        opacity: 1;
                    }
                }
                .k-item-content {
                    .k-content-action {
                        .k-button-icon {
                            opacity: 1;
                        }
                    }
                }
            }
        }
        .k-item-cardlet {
            width: 100%;
            display: flex;
            align-items: flex-start;
            .k-item-handle {
                width: 24px;
                height: 2.375rem;
                display: flex;
                flex-shrink: 0;
                align-items: center;
                justify-content: center;
                .k-handle-icon {
                    width: 14px;
                    height: 26px;
                    opacity: 0.2;
                    display: flex;
                    cursor: pointer;
                    transition: opacity 0.3s ease;
                }
            }
            .k-item-content {
                width: 100%;
                display: flex;
                grid-auto-flow: column;
                box-shadow: var(--shadow);
                overflow: visible!important;
                border-radius: var(--rounded);
                background: var(--color-white);
                transition: all 0.3s ease-in-out;
                .k-content-display {
                    display: flex;
                    flex-shrink: 0;
                    width: 2.375rem;
                    height: 2.375rem;
                    overflow: hidden;
                    user-select: none;
                    background: var(--color-gray-600);
                    border-radius: var(--rounded) 0 0 var(--rounded);
                    .k-item-figure {
                        width: 2.375rem!important;
                    }
                }
                .k-content-meta {
                    width: 100%;
                    display: flex;
                    height: 2.375rem;
                    padding: 0 0.75rem;
                    align-items: center;
                    justify-content: space-between;
                    .k-meta-title {
                        overflow: hidden;
                        font-weight: 400;
                        white-space: nowrap;
                        line-height: 1.125rem;
                        text-overflow: ellipsis;
                        font-size: var(--text-sm);
                        .k-title-suffix {
                            font-weight: 400;
                            white-space: nowrap;
                            line-height: 1.125rem;
                            font-size: var(--text-sm);
                            color: var(--color-negative);
                        }
                    }
                    .k-meta-children {
                        overflow: hidden;
                        font-weight: 400;
                        white-space: nowrap;
                        line-height: 1.125rem;
                        text-overflow: ellipsis;
                        font-size: var(--text-sm);
                    }
                }
                .k-content-action {
                    display: flex;
                    padding:0 0.75rem;
                    position: relative;
                    align-items: center;
                    .k-item-menu {
                        .k-button {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            .k-button-icon {
                                width: 18px;
                                height: 26px;
                                opacity: 0.2;
                                display: flex;
                                cursor: pointer;
                                transition: opacity 0.3s ease;
                            }
                        }
                    }
                }
            }
        }
    }

</style>


