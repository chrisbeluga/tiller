<template>

    <div>
        <k-dropdown
            class="k-tiller-menu">
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
                        Add pages from the Kirby file system
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
                        Add files from the Kirby file system
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
                        Add a custom link not from the Kirby file system
                    </p>
                </k-dropdown-item>
            </k-dropdown-content>
        </k-dropdown>
        <k-pages-dialog
            ref="pages"
            v-on:submit="add">
        </k-pages-dialog>
        <k-files-dialog
            ref="files"
            v-on:submit="add">
        </k-files-dialog>
    </div>

</template>

<script>

	export default {
		name: 'option',
		props: {
            list: {
                type: Array,
                required: true
            },
            pages: {
                type: Object,
                required: true,
            },
            files: {
                type: Object,
                required: true,
            },
            endpoints: {
                type: Object,
                required: true,
            }
        },
        methods: {
            add(data) {
                this.$emit('add', { 
                    item: data, 
                    children: this.list 
                })
            }
        }
	}

</script>