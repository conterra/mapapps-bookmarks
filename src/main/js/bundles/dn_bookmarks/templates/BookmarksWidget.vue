<!--

    Copyright (C) 2019 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <new-bookmark-widget
        v-if="showNewBookmarkWidget"
        :i18n="i18n"
        @cancel="showNewBookmarkWidget=false"
        @add-bookmark="emitAddBookmark">
    </new-bookmark-widget>
    <edit-bookmark-widget
        v-else-if="editBookmark"
        :bookmark="editBookmark"
        :i18n="i18n"
        @cancel="editBookmark=undefined"
        @save-bookmark="emitSaveBookmark"
        @remove-bookmark="emitRemoveBookmark">
    </edit-bookmark-widget>
    <v-container
        v-else
        class="pa-0"
        fluid
        fill-height>
        <v-layout column>
            <v-flex style="overflow-y:auto;">
                <v-list class="pa-0">
                    <bookmark-widget
                        v-for="(bookmark, index) in bookmarks"
                        :key="index"
                        :bookmark="bookmark"
                        :i18n="i18n"
                        :is-selected="bookmark === activeBookmark"
                        @goto-bookmark="emitGoToBookmark"
                        @remove-bookmark="emitRemoveBookmark"
                        @edit-bookmark="editBookmark=bookmark">
                    </bookmark-widget>
                </v-list>
            </v-flex>
            <v-flex shrink>
                <v-layout row>
                    <v-flex class="pl-1">
                        <v-btn
                            class="my-0"
                            color="primary"
                            block
                            @click="showNewBookmarkWidget=true">
                            <v-icon left>add</v-icon>
                            {{ i18n.newBookmark }}
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>

    import Bindable from "apprt-vue/mixins/Bindable";
    import BookmarkWidget from "./BookmarkWidget.vue";
    import NewBookmarkWidget from "./NewBookmarkWidget.vue";
    import EditBookmarkWidget from "./EditBookmarkWidget.vue";

    export default {
        components: {
            "bookmark-widget": BookmarkWidget,
            "new-bookmark-widget": NewBookmarkWidget,
            "edit-bookmark-widget": EditBookmarkWidget
        },
        mixins: [Bindable],
        props: {
            bookmarks: {
                type: Array,
                default: () => []
            },
            activeBookmark: {
                type: Object,
                default: () => {
                }
            },
            i18n: {
                type: Object,
                default: () => {
                }
            }
        },
        data: function () {
            return {
                showNewBookmarkWidget: false,
                showClearDialog: false,
                editBookmark: undefined
            }
        },
        methods: {
            emitAddBookmark(name) {
                this.showNewBookmarkWidget = false;
                this.$emit('add-bookmark', name);
            },
            emitRemoveBookmark(bookmark) {
                this.editBookmark = undefined;
                this.$emit('remove-bookmark', bookmark);
            },
            emitClearBookmarks() {
                this.showClearDialog = false;
                this.$emit('clear-bookmarks');
            },
            emitGoToBookmark(bookmark) {
                this.$emit('goto-bookmark', bookmark);
            },
            emitSaveBookmark(bookmark, name) {
                this.editBookmark = undefined;
                this.$emit('rename-bookmark', bookmark, name);
            }
        }
    }
</script>
