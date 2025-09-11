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

export default class BookmarksWidgetFactory {

    createInstance() {
        const bookmarksModel = this._getBookmarksModel();
        this._setupViewMonitoring(bookmarksModel);
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

        return widget;
    }
    _setupViewMonitoring(bookmarksModel) {



        const mapWidgetModel = this._mapWidgetModel;

        if (!mapWidgetModel) {
            console.error("MapWidgetModel nicht gefunden!");
            return;
        }


        const initialView = mapWidgetModel.view;
        if (initialView) {

            bookmarksModel.updateViewReference(initialView);
        } else {
            console.warn("Keine initiale View vorhanden!");
        }


        mapWidgetModel.watch("view", function (newViewObj) {

            const newView = newViewObj.value;

            if (newView) {
                bookmarksModel.updateViewReference(newView);
            } else {
                console.warn("Neue View ist null!");
            }
        });
    }

    deactivate() {
        this[_binding].unbind();
        this[_binding] = undefined;
    }

    _getBookmarksModel() {
        const bookmarksModel = new BookmarksModel(this._properties);
        this._getView().then((view) => {
            bookmarksModel.view = view;
        });
        return bookmarksModel;
    }

    _getView() {
        const mapWidgetModel = this._mapWidgetModel;
        return new Promise((resolve) => {
            if (mapWidgetModel.view) {
                resolve(mapWidgetModel.view);
            } else {
                mapWidgetModel.watch("view", ({ value: view }) => {
                    resolve(view);
                });
            }
        });
    }
}
