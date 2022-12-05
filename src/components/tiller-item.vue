<template>

    <article
        class="k-tiller-item">
        <div
            class="k-item-cardlet">
            <div
                v-if="status"
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
                    v-on:click="drawer_edit">
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
                    v-on:click="drawer_edit">
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
                        v-if="status"
                        class="k-item-menu">
                        <k-button
                            icon="dots"
                            v-on:click="dialog_tiller">
                        </k-button>
                        <k-dropdown-content
                            ref="dialog_tiller"
                            align="right">
                            <k-dropdown-item
                                v-on:click="dialog_pages(item)">
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
                                    Add pages from the kirby file system as a child to {{ item.title }}
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
                                    Add files from the kirby file system as a child to {{ item.title }}
                                </p>
                            </k-dropdown-item>
                            <k-dropdown-item
                                v-on:click="dialog_pages">
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
                                    Add a custom link not from the kirby file system as a child to {{ item.title }}
                                </p>
                            </k-dropdown-item>
                            <k-dropdown-item>
                                <div
                                    class="k-menu-divider">
                                </div>
                            </k-dropdown-item>
                            <k-dropdown-item
                                v-on:click="drawer_edit">
                                <div
                                    class="k-menu-title">
                                    <k-icon
                                        type="edit"
                                        class="k-menu-icon">
                                    </k-icon>
                                    <span>
                                        Edit Item
                                    </span>
                                </div>
                                <p
                                    class="k-menu-text">
                                    Edit custom fields for this menu item
                                </p>
                            </k-dropdown-item>
                            <k-dropdown-item
                                v-on:click="dialog_remove">
                                <div
                                    class="k-menu-title k-menu-negative">
                                    <k-icon
                                        type="trash"
                                        class="k-menu-icon">
                                    </k-icon>
                                    <span>
                                        Remove Item
                                    </span>
                                </div>
                                <p
                                    class="k-menu-text">
                                    Remove this item from the menu
                                </p>
                            </k-dropdown-item>
                        </k-dropdown-content>
                    </k-dropdown>
                </div>
            </div>
        </div>
        <k-pages-dialog
            ref="dialog_pages"
            v-on:submit="action_kirby">
        </k-pages-dialog>
    	<k-files-dialog
            ref="dialog_files"
            v-on:submit="action_kirby">
        </k-files-dialog>
        <k-drawer
            icon="bolt"
            ref="drawer_edit"
            v-bind:title="'Edit ' + item.title">
            <k-form 
                v-model="item.fields" 
                v-bind:fields="fieldsets">
            </k-form>
        </k-drawer>
        <k-dialog
            icon="trash"
            theme="negative"
            ref="dialog_remove"
            submitButton="Remove"
            v-on:submit="action_remove">
            <k-text>
                Do you really want to remove <strong>{{ item.title }}</strong>?
                <div 
                    v-if="item.children.length">
                    It has the following menu items directly underneath:
                    <span
                        v-for="(children, index) in item.children">
                        {{ children.title }}<br />
                    </span>
                </div>
            </k-text>
        </k-dialog>
    </article>

</template>

<script>

    export default {
        name: 'tiller-item',
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
            status: {
                type: Boolean,
                required: true
            },
            search: {
                type: Object,
                required: true
            },
            fields: {
                type: Object,
                required: true
            },
            fieldsets: {
                type: Object,
                required: true
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
            drawer_edit() {
                this.$refs.drawer_edit.open()
            },
            dialog_tiller() {
                this.$refs.dialog_tiller.open()
            },
            dialog_remove(data) {
                this.$refs.dialog_remove.open()
            },
            dialog_close() {
                this.$refs.dialog_remove.close()
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
                    this.item.children.push({
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
            action_remove() {
                this.$emit('action_remove', {
                    haystack: this.list,
                    needle: this.item.id
                })
                this.dialog_close()
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
