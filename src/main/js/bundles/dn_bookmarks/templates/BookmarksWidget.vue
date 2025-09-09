<!--

    Copyright (C) 2025 con terra GmbH (info@conterra.de)

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
        @add-bookmark="emitAddBookmark"
    />
    <edit-bookmark-widget
        v-else-if="editBookmark"
        :bookmark="editBookmark"
        :i18n="i18n"
        @cancel="editBookmark=undefined"
        @save-bookmark="emitSaveBookmark"
    />
    <question-widget
        v-else-if="removeBookmark"
        :question="i18n.removeBookmarkQuestion"
        :i18n="i18n"
        @no="removeBookmark=undefined"
        @yes="emitRemoveBookmark"
    />
    <question-widget
        v-else-if="removeAllBookmarks"
        :question="i18n.removeAllBookmarksQuestion"
        :i18n="i18n"
        @no="removeAllBookmarks=false"
        @yes="emitRemoveAllBookmarks"
    />
    <v-container
        v-else
        class="pa-0"
        fluid
        fill-height
    >
        <v-layout column>
            <v-flex style="overflow-y:auto;">
                <v-list
                    class="pa-0"
                    :aria-label="i18n.listOfBookmarks"
                >
                    <bookmark-widget
                        v-for="(bookmark, index) in bookmarks"
                        :key="index"
                        :bookmark="bookmark"
                        :show-thumbnails="showThumbnails"
                        :i18n="i18n"
                        :is-selected="bookmark === activeBookmark"
                        :last-bookmark="index === bookmarks.length-1"
                        @goto-bookmark="emitGoToBookmark"
                        @remove-bookmark="removeBookmark=bookmark"
                        @edit-bookmark="editBookmark=bookmark"
                    />
                </v-list>
            </v-flex>
            <v-flex shrink>
                <v-layout row>
                    <v-flex
                        class="pr-1"
                        shrink
                    >
                        <v-btn
                            class="my-0"
                            color="error"
                            block
                            outline
                            :disabled="!deleteAllAvailable"
                            @click="removeAllBookmarks=true"
                        >
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex
                        class="pl-1"
                        grow
                    >
                        <v-btn
                            class="my-0"
                            color="primary"
                            block
                            @click="showNewBookmarkWidget=true"
                        >
                            <v-icon left>
                                add
                            </v-icon>
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
    import QuestionWidget from "./QuestionWidget.vue";

    export default {
        components: {
            "bookmark-widget": BookmarkWidget,
            "new-bookmark-widget": NewBookmarkWidget,
            "edit-bookmark-widget": EditBookmarkWidget,
            "question-widget": QuestionWidget
        },
        mixins: [Bindable],
        props: {
            activeBookmark: {
                type: Object,
                default: () => {
                }
            },
            showThumbnails: {
                type: Boolean,
                default: true
            },
            deleteAllAvailable: {
                type: Boolean,
                default: false
            },
            i18n: {
                type: Object,
                default: () => {
                }
            }
        },
        data: function () {
            return {
                bookmarks: [],
                showNewBookmarkWidget: false,
                editBookmark: undefined,
                removeBookmark: undefined,
                removeAllBookmarks: false
            };
        },
        methods: {
            emitAddBookmark(name) {
                this.showNewBookmarkWidget = false;
                this.$emit('add-bookmark', name);
            },
            emitRemoveBookmark() {
                this.editBookmark = undefined;
                this.$emit('remove-bookmark', this.removeBookmark);
                this.removeBookmark = undefined;
            },
            emitRemoveAllBookmarks() {
                this.removeAllBookmarks = false;
                this.$emit('remove-all-bookmarks');
            },
            emitGoToBookmark(bookmark) {
                this.$emit('goto-bookmark', bookmark);
            },
            emitSaveBookmark(bookmark, name) {
                this.editBookmark = undefined;
                this.$emit('rename-bookmark', bookmark, name);
            }
        }
    };
</script>
