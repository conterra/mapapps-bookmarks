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
        this.showThumbnails = args.showThumbnails;

        this.defaultCreateOptions = {
            captureExtent: false,
            captureViewpoint: true,
            captureRotation: true,
            captureScale: true
        };

        this.bookmarks.on("after-changes", () => {
            while (this.bookmarksArray.length > 0) {
                this.bookmarksArray.pop();
            }
            const bookmarks = this.bookmarks.toArray();
            bookmarks.forEach((bookmark) => {
                this.bookmarksArray.push({
                    id: bookmark.uid,
                    name: bookmark.name,
                    thumbnail: bookmark.thumbnail,
                    predefined: bookmark.predefined
                });
            });

            this.deleteAllAvailable = this._checkDeleteAvailable();
        });

        this._addBookmarks();
    },

    // define custom properties added to enable watching/binding them
    properties: {
        activeBookmark: {},
        showThumbnails: {},
        deleteAllAvailable: {}
    },

    addBookmark(name) {
        this.createBookmark().then((bookmark) => {
            bookmark.name = this._checkBookmarkNameForUniqueness(name) || "Bookmark";
            this.bookmarks.add(bookmark);
            this._sortBookmarks();
            this._storeBookmarksInLocalStorage();
            this.deleteAllAvailable = this._checkDeleteAvailable();
        });
    },

    removeBookmark(id) {
        const bookmark = this.bookmarks.find((b) => id === b.uid);
        this.bookmarks.remove(bookmark);
        this._sortBookmarks();
        this._storeBookmarksInLocalStorage();
        this.deleteAllAvailable = this._checkDeleteAvailable();
    },

    renameBookmark(id, newName) {
        const bookmark = this.bookmarks.find((b) => id === b.uid);
        bookmark.name = newName;
        this._sortBookmarks();
        this._storeBookmarksInLocalStorage();
    },

    removeAllBookmarks() {
        this.bookmarks.removeAll();
        const predefinedBookmarks = this._getPredefinedBookmarks();
        this.bookmarks.push(...predefinedBookmarks);
        this._sortBookmarks();
        this._storeBookmarksInLocalStorage();
        this.deleteAllAvailable = this._checkDeleteAvailable();
    },

    zoomToBookmark(id) {
        const bookmark = this.bookmarks.find((b) => id === b.uid);
        this.goTo(bookmark);
    },

    _addBookmarks() {
        try {
            const storedBookmarks = this._readBookmarksFromLocalStorage();
            const predefinedBookmarks = this._getPredefinedBookmarks();
            this.bookmarks.push(...storedBookmarks);
            this.bookmarks.push(...predefinedBookmarks);
            this._sortBookmarks();
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
            const plainBookmarks = userDefinedBookmarks.map((bookmark) => {
                const object = bookmark.toJSON();
                delete object.extent;
                if (object.viewpoint?.targetGeometry) {
                    object.viewpoint.targetGeometry.type = "extent";
                }
                return object;
            });
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

    _sortBookmarks() {
        this.bookmarks.sort(function (a, b) {
            if (a.predefined && !b.predefined) {
                return -1;
            } else if (b.predefined && !a.predefined) {
                return 1;
            } else if (a.name < b.name) {
                return -1;
            } else if (a.name > b.name) {
                return 1;
            } else {
                return 0;
            }
        });
    },

    _checkBookmarkNameForUniqueness(name) {
        const existingBookmarks = this.bookmarksArray;

        let matchCounter = 0;
        existingBookmarks.forEach(bookmark => {
            if (bookmark.name === name || bookmark.name.split("_")[0] === name.split("_")[0]) {
                matchCounter++;
            }
        });

        if (matchCounter > 0) {
            return name + "_" + matchCounter;
        } else {
            return name;
        }
    },

    _checkDeleteAvailable() {
        return (this.bookmarksArray.length > this.predefinedBookmarks.length);
    }

});
