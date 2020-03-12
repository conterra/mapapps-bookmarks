/*
 * Copyright (C) 2019 con terra GmbH (info@conterra.de)
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
import Bookmark from "esri/webmap/Bookmark";
import BookmarksViewModel from "esri/widgets/Bookmarks/BookmarksViewModel";
import Collection from "esri/core/Collection";

export default BookmarksViewModel.createSubclass({
    _localStorage: window.localStorage,

    constructor(args) {
        this.bookmarks = new Collection();
        this.bookmarksArray = [];
        this.localStorageKey = args.localStorageKey;
        this.predefinedBookmarks = args.predefinedBookmarks;

        this.bookmarks.on("after-changes", () => {
            while (this.bookmarksArray.length > 0) {
                this.bookmarksArray.pop();
            }
            const bookmarks = this.bookmarks.toArray();
            bookmarks.forEach((bookmark) => {
                this.bookmarksArray.push(bookmark);
            })
        });

        this._addBookmarks();
    },

    addBookmark(name) {
        this.createBookmark().then((bookmark) => {
            bookmark.name = name || "Bookmark";
            this.bookmarks.add(bookmark);
            this.bookmarks.sort(this._compareBookmarks);
            this._storeBookmarksInLocalStorage();
        });
    },

    removeBookmark(bookmark) {
        this.bookmarks.remove(bookmark);
        this.bookmarks.sort(this._compareBookmarks);
        this._storeBookmarksInLocalStorage();
    },

    renameBookmark(bookmark, newName) {
        bookmark.name = newName;
        this.bookmarks.sort(this._compareBookmarks);
        this._storeBookmarksInLocalStorage();
    },

    removeAllBookmarks() {
        this.bookmarks.removeAll();
        const predefinedBookmarks = this._getPredefinedBookmarks();
        this.bookmarks.push(...predefinedBookmarks);
        this.bookmarks.sort(this._compareBookmarks);
        this._storeBookmarksInLocalStorage();
    },

    _addBookmarks() {
        try {
            const storedBookmarks = this._readBookmarksFromLocalStorage();
            const predefinedBookmarks = this._getPredefinedBookmarks();
            this.bookmarks.push(...storedBookmarks);
            this.bookmarks.push(...predefinedBookmarks);
            this.bookmarks.sort(this._compareBookmarks);
        } catch (exception) {
            console.error(exception);
        }
    },

    _getPredefinedBookmarks() {
        const predefinedBookmarks = this.predefinedBookmarks;
        return predefinedBookmarks.map((object) => new Bookmark(object))
            .map((bookmark) => {
                bookmark.predefined = true;
                return bookmark;
            });
    },

    _storeBookmarksInLocalStorage() {
        try {
            const userDefinedBookmarks = this.bookmarks.filter((bookmark) => !bookmark.predefined);
            const plainBookmarks = userDefinedBookmarks.map((bookmark) => bookmark.toJSON());
            const bookmarksString = JSON.stringify(plainBookmarks);
            this._localStorage.setItem(this.localStorageKey, bookmarksString);
        } catch (exception) {
            console.error(exception);
        }
    },

    _readBookmarksFromLocalStorage() {
        const bookmarksString = this._localStorage.getItem(this.localStorageKey);
        if (bookmarksString !== null) {
            return JSON.parse(bookmarksString).map((object) => new Bookmark(object));
        } else {
            return [];
        }
    },

    _compareBookmarks(a, b) {
        if (a.predefined && !b.predefined)
            return -1;
        else if (b.predefined && !a.predefined)
            return 1;
        else if (a.name < b.name)
            return -1;
        else if (a.name > b.name)
            return 1;
        else
            return 0;
    }

});
