/*
 * Copyright (C) 2025 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import BookmarksWidget from "./templates/BookmarksWidget.vue";
import Binding from "apprt-binding/Binding";
import BookmarksModel from "./BookmarksModel";

const _binding = Symbol("_binding");
const _mapBinding = Symbol("_mapBinding");

export default class BookmarksWidgetFactory {

    createInstance() {
        const bookmarksModel = new BookmarksModel(this._properties);
        const mapWidgetModel = this._mapWidgetModel;
        const vm = new Vue(BookmarksWidget);
        const widget = VueDijit(vm, { class: "fullHeight" });

        vm.i18n = this._i18n.get().ui;

        vm.$on('add-bookmark', (name) => {
            bookmarksModel.addBookmark(name);
        });
        vm.$on('remove-bookmark', (bookmark) => {
            bookmarksModel.removeBookmark(bookmark.id);
        });
        vm.$on('goto-bookmark', (bookmark) => {
            bookmarksModel.zoomToBookmark(bookmark.id);
        });
        vm.$on('remove-all-bookmarks', () => {
            bookmarksModel.removeAllBookmarks();
        });
        vm.$on('rename-bookmark', (bookmark, name) => {
            bookmarksModel.renameBookmark(bookmark.id, name);
        });

        this[_binding] = Binding.for(vm, bookmarksModel)
            .syncToLeft("bookmarksArray", "bookmarks")
            .syncAllToLeft("activeBookmark", "showThumbnails", "deleteAllAvailable")
            .enable()
            .syncToLeftNow();

        this[_mapBinding] = Binding.for(bookmarksModel, mapWidgetModel)
            .syncToLeft("view")
            .enable()
            .syncToLeftNow();

        return widget;
    }

    deactivate() {
        this[_binding].unbind();
        this[_mapBinding].unbind();
        this[_binding] = undefined;
        this[_mapBinding] = undefined;
    }

}
