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
import reactiveUtils from "esri/core/reactiveUtils";


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


    properties: {
        activeBookmark: {},
        showThumbnails: {},
        deleteAllAvailable: {}
    },

    addBookmark(name) {
        if (!name || typeof name !== "string") {
            return;
        }

        const view = this.view;
        if (!view) {
            return;
        }


        const uniqueName = this._checkBookmarkNameForUniqueness(name);
        if (!uniqueName) {
            return;
        }




        reactiveUtils.whenOnce(() => view.ready)
            .then(() => {

                setTimeout(() => {
                    try {

                        if (view.type === "3d") {

                            this._create3DBookmarkWithScreenshot(uniqueName);
                        } else {

                            this._create2DBookmark(uniqueName);
                        }
                    } catch (error) {

                        this._createFallbackBookmark(uniqueName);
                    }
                }, 200);
            })
            .catch(error => {

                this._createFallbackBookmark(uniqueName);
            });
    },

    _create2DBookmark(name) {
        try {
            const view = this.view;
            if (!view) return;

            const viewpoint = {
                targetGeometry: view.extent,
                scale: view.scale,
                rotation: view.rotation || 0
            };

            view.takeScreenshot({
                width: 150,
                height: 100,
                format: "png"
            }).then(screenshot => {

                const bookmark = new Bookmark({
                    name: name,
                    viewpoint: viewpoint,
                    thumbnail: {
                        url: screenshot.dataUrl
                    }
                });


                bookmark.uid = Date.now().toString();

                this.bookmarks.add(bookmark);
                this._sortBookmarks();
                this._storeBookmarksInLocalStorage();
                this.deleteAllAvailable = this._checkDeleteAvailable();


            }).catch(error => {
                this._createBookmarkWithoutScreenshot(name, viewpoint);
            });
        } catch (error) {
            this._createFallbackBookmark(name);
        }
    },


    _createBookmarkWithoutScreenshot(name, viewpoint) {
        try {

            const bookmark = new Bookmark({
                name: name,
                viewpoint: viewpoint,
                thumbnail: {
                    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAASFBMVEUAAAD///8JCQlFRUXs7OzBwcEuLi6enp739/eJiYlhYWHV1dW0tLR4eHhOTk7i4uI3NzfIyMioqKgaGhrY2NiSkpJycnJoaGg/C6MaAAAELklEQVR4nO1c65qjIAx1uKiIl9bL+7/pIqi1tTPDbKsS9vD92M+dbZwDIQm5BAEHBwcHBwcHBwcHBwcHBwdnCP94MX8GIiYAlAQksIeUCxghIv5R4PgCPA0JevqdHeY+YDeGEOvwKztSoVAFp8oaUBN0zqNUNXAYeDaAz1mO+ZrnnABoRCAEaz+Zr4P9X0hwjoZncKavxJUGRHhGXCMUTCgFCP/FhQiuZbUAMQCj77kyE1ob8GOzyoIvFxHZhkeC+4zSrzZWr9C8Z+JwmfnUaMjXJK+4xBFddksA8Xoq/ThxZI4sARHDrxzD33mkMdJwPQ3VbtXE+9MQrWodrFyE1gU7LHQcOTiUAshgTsTm5+LqiEjGg+OVsZYnMlXGKnUiJfVcRMWXO1gB9lgoGG2Igno3DMdazg4XogJU5a6Z+brScY20mJICJsZCb+NiQwvCCkayoxWYcjFSWnNRUqENoKPgFkRsikVofZxVqZtRcRGhe8wpVKymdQItShiRSmQmWOgCRmm2hDHlA6ZUqeP0DxiE4L6rPWCKpUFVOCJ0vI3FJQzKOg1jnSI11/Qxl5IMLpByc42DsUGGlpVg+4kArFP7j9AaWi+7T5GEuElcuD68xrAwW33XwLlSMnLtBZvQCq39qweCPxaUYWVZVs0lzLcf9TzP3YR++sw3omWLa0FKAvuvxZVlKWwlV5R/o5nQm9COBIM/T4ZoEsIvWJBUTpHgLHW5+zJJ3i+GJSlrBtvwCv+T1+k1pUzSpMfASdxsscFmA9dpO6lzL4zDiukQWUlVPEZkWBWuuvqwTRYvFzPcmgydAbXwqt5Cq5u6b0g7caVivN+AbdUqRbVgm6NBZTZvVY0G5PLf0gb9cCkUDh2qhIt1URi25us11O1oao626DI042J2t4tlGH+Lxc4YbXB7LBYqvAla36yLfU/EOfCUL+yM70Z9E3dfyzQ4yBJj4ZdHaq7+rtGqqGX5b2nmiTyxh3e93HtV5c1YX1WG8c9+srn6yL7SaSy0zzRfbWqf7bxq1XfaF7v2xqZa+mS2+rHNN3tqEbt11f8uoP0c1OOeBLRDXmEtTl1yXR0xB7zCWpy8pGhj6UZ8rQObscS9IIwZ0c0MPI5bbCl2wZiisR0aE1vcY5f68jlshxMBlm/apCnkbUFYDvqB/8VmX0EY+QmeDQmD/SD097TYjmmwzZWZtiHJD3pCGlH8QIivaP6AFshuWAybqJhfV2Ovu++IxGrYNxFeSdBGYc/xsplgZN4gmppRWDHDJDoWIrCxLfNPLQjLsS2kxmSbRMzzmL15E9vBNBOmmWyw8cXW0M+ZMZvVyGCue1rNMNdTwUbL8iNyW0Nfcw1lyTWUpe5JzIu4EVm61GbGoiyYPaKIDzUO2pYGPrwCHBwcHBwcHBwcHBwcHH+b/wDi1jN3dZ4dDQAAAABJRU5ErkJggg=="
                }
            });


            bookmark.uid = Date.now().toString();


            this.bookmarks.add(bookmark);
            this._sortBookmarks();
            this._storeBookmarksInLocalStorage();
            this.deleteAllAvailable = this._checkDeleteAvailable();


        } catch (error) {
            // Error-Handling
        }
    },

    _addLocalUserBookmark(bookmark) {

        if (!bookmark.uid) {
            bookmark.uid = Date.now().toString();
        }


        this.bookmarks.add(bookmark);


        this._sortBookmarks();
        this._storeBookmarksInLocalStorage();
        this.deleteAllAvailable = this._checkDeleteAvailable();
    },


    async _create3DBookmarkWithScreenshot(name) {
        try {
            const view = this.view;
            if (!view || view.type !== "3d") {
                return;
            }


            await new Promise(resolve => setTimeout(resolve, 300));


            const screenshot = await view.takeScreenshot({
                format: "png",
                width: 150,
                height: 100
            });


            const viewpoint = {
                targetGeometry: view.extent,
                scale: view.scale,
                rotation: view.rotation || 0
            };


            if (view.camera) {
                viewpoint.camera = view.camera.clone();
            }

            const uniqueName = this._checkBookmarkNameForUniqueness(name) || "Bookmark";

            const bookmark = new Bookmark({
                name: uniqueName,
                viewpoint: viewpoint,
                thumbnail: {
                    url: screenshot.dataUrl
                }
            });

            bookmark.uid = Date.now().toString();


            this.bookmarks.add(bookmark);
            this._sortBookmarks();
            this._storeBookmarksInLocalStorage();
            this.deleteAllAvailable = this._checkDeleteAvailable();

        } catch (error) {

            this._createFallbackBookmark(name);
        }
    },


    _createFallbackBookmark(name) {
        try {
            const view = this.view;
            if (!view) return;

            const viewpoint = {
                targetGeometry: view.extent,
                scale: view.scale,
                rotation: view.rotation || 0
            };

            if (view.camera) {
                viewpoint.camera = view.camera.clone();
            }

            const uniqueName = this._checkBookmarkNameForUniqueness(name) || "Bookmark";


            const bookmark = new Bookmark({
                name: uniqueName,
                viewpoint: viewpoint,
                thumbnail: {
                    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAASFBMVEUAAAD///8JCQlFRUXs7OzBwcEuLi6enp739/eJiYlhYWHV1dW0tLR4eHhOTk7i4uI3NzfIyMioqKgaGhrY2NiSkpJycnJoaGg/C6MaAAAELklEQVR4nO1c65qjIAx1uKiIl9bL+7/pIqi1tTPDbKsS9vD92M+dbZwDIQm5BAEHBwcHBwcHBwcHBwcHBwdnCP94MX8GIiYAlAQksIeUCxghIv5R4PgCPA0JevqdHeY+YDeGEOvwKztSoVAFp8oaUBN0zqNUNXAYeDaAz1mO+ZrnnABoRCAEaz+Zr4P9X0hwjoZncKavxJUGRHhGXCMUTCgFCP/FhQiuZbUAMQCj77kyE1ob8GOzyoIvFxHZhkeC+4zSrzZWr9C8Z+JwmfnUaMjXJK+4xBFddksA8Xoq/ThxZI4sARHDrxzD33mkMdJwPQ3VbtXE+9MQrWodrFyE1gU7LHQcOTiUAshgTsTm5+LqiEjGg+OVsZYnMlXGKnUiJfVcRMWXO1gB9lgoGG2Igno3DMdazg4XogJU5a6Z+brScY20mJICJsZCb+NiQwvCCkayoxWYcjFSWnNRUqENoKPgFkRsikVofZxVqZtRcRGhe8wpVKymdQItShiRSmQmWOgCRmm2hDHlA6ZUqeP0DxiE4L6rPWCKpUFVOCJ0vI3FJQzKOg1jnSI11/Qxl5IMLpByc42DsUGGlpVg+4kArFP7j9AaWi+7T5GEuElcuD68xrAwW33XwLlSMnLtBZvQCq39qweCPxaUYWVZVs0lzLcf9TzP3YR++sw3omWLa0FKAvuvxZVlKWwlV5R/o5nQm9COBIM/T4ZoEsIvWJBUTpHgLHW5+zJJ3i+GJSlrBtvwCv+T1+k1pUzSpMfASdxsscFmA9dpO6lzL4zDiukQWUlVPEZkWBWuuvqwTRYvFzPcmgydAbXwqt5Cq5u6b0g7caVivN+AbdUqRbVgm6NBZTZvVY0G5PLf0gb9cCkUDh2qhIt1URi25us11O1oao626DI042J2t4tlGH+Lxc4YbXB7LBYqvAla36yLfU/EOfCUL+yM70Z9E3dfyzQ4yBJj4ZdHaq7+rtGqqGX5b2nmiTyxh3e93HtV5c1YX1WG8c9+srn6yL7SaSy0zzRfbWqf7bxq1XfaF7v2xqZa+mS2+rHNN3tqEbt11f8uoP0c1OOeBLRDXmEtTl1yXR0xB7zCWpy8pGhj6UZ8rQObscS9IIwZ0c0MPI5bbCl2wZiisR0aE1vcY5f68jlshxMBlm/apCnkbUFYDvqB/8VmX0EY+QmeDQmD/SD097TYjmmwzZWZtiHJD3pCGlH8QIivaP6AFshuWAybqJhfV2Ovu++IxGrYNxFeSdBGYc/xsplgZN4gmppRWDHDJDoWIrCxLfNPLQjLsS2kxmSbRMzzmL15E9vBNBOmmWyw8cXW0M+ZMZvVyGCue1rNMNdTwUbL8iNyW0Nfcw1lyTWUpe5JzIu4EVm61GbGoiyYPaKIDzUO2pYGPrwCHBwcHBwcHBwcHBwcHH+b/wDi1jN3dZ4dDQAAAABJRU5ErkJggg=="
                }
            });

            bookmark.uid = Date.now().toString();


            this.bookmarks.add(bookmark);
            this._sortBookmarks();
            this._storeBookmarksInLocalStorage();
            this.deleteAllAvailable = this._checkDeleteAvailable();

        } catch (error) {
            //error handling
        }
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

        if (!bookmark) {
            return;
        }


        setTimeout(() => {

            const view = this.view;

            if (!view) {
                return;
            }

            reactiveUtils.whenOnce(() => view.ready)
                .then(() => {

                    if (view && !view.destroyed) {
                        this._executeGoToBookmark(bookmark, view);
                    } else {
                        //warn
                    }
                })
                .catch(error => {
                    //error
                });
        }, 300);
    },

    _executeGoToBookmark(bookmark, view) {

        if (!bookmark) {
            return;
        }

        if (!view) {
            return;
        }

        if (!view.goTo || typeof view.goTo !== "function") {
            return;
        }

        try {

            const adaptedViewpoint = this._adaptViewpointToCurrentView(bookmark, view);
            if (!adaptedViewpoint) {
                return;
            }





            view.goTo(adaptedViewpoint)
                .catch(error => {
                    this._tryFallbackNavigation(view, bookmark);
                });
        } catch (error) {
            this._tryFallbackNavigation(view, bookmark);
        }
    },


    _tryFallbackNavigation(view, bookmark) {
        try {

            if (!view || !view.goTo || typeof view.goTo !== "function") {
                return;
            }


            if (!bookmark.viewpoint || !bookmark.viewpoint.targetGeometry) {
                return;
            }


            view.goTo({
                target: bookmark.viewpoint.targetGeometry
            }).catch(e => {
            });
        } catch (error) {
            // Fehlerbehandlung
        }
    },

    _addBookmarks() {
        try {
            const storedBookmarks = this._readBookmarksFromLocalStorage();
            const predefinedBookmarks = this._getPredefinedBookmarks();
            this.bookmarks.push(...storedBookmarks);
            this.bookmarks.push(...predefinedBookmarks);
            this._sortBookmarks();
        } catch (exception) {
            //Fehlerbehandlung
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


    updateViewReference(newView) {

        if (this.view) {
            //ok
        }
        this.view = newView;
        if (this.view) {
            //ok
        } else {
            //warn
        }
    },

    _adaptViewpointToCurrentView(bookmark, view) {
        if (!bookmark || !bookmark.viewpoint || !view) {
            return null;
        }

        const viewpoint = bookmark.viewpoint;
        const is3DView = view.type === "3d";
        const has3DCamera = viewpoint.camera && viewpoint.camera.position;


        if (!viewpoint.targetGeometry) {
            return viewpoint;
        }


        if (is3DView && !has3DCamera) {
            return {
                target: viewpoint.targetGeometry,
                scale: viewpoint.scale || view.scale,
                rotation: viewpoint.rotation || 0
            };
        }

        if (!is3DView && has3DCamera) {
            return {
                target: viewpoint.targetGeometry,
                scale: viewpoint.scale || view.scale,
                rotation: viewpoint.rotation || 0
            };
        }


        return viewpoint;
    },

    _storeBookmarksInLocalStorage() {
        try {
            const userDefinedBookmarks = this.bookmarks.filter((bookmark) => !bookmark.predefined);
            const plainBookmarks = userDefinedBookmarks.map((bookmark) => {

                const object = {};


                object.name = bookmark.name;


                if (bookmark.viewpoint) {
                    object.viewpoint = {
                        scale: bookmark.viewpoint.scale,
                        rotation: bookmark.viewpoint.rotation
                    };

                    if (bookmark.viewpoint.targetGeometry) {
                        object.viewpoint.targetGeometry = bookmark.viewpoint.targetGeometry.toJSON();
                        object.viewpoint.targetGeometry.type = "extent";
                    }

                    if (bookmark.viewpoint.camera) {
                        object.viewpoint.camera = bookmark.viewpoint.camera.toJSON();
                    }
                }


                if (bookmark.thumbnail) {
                    object.thumbnail = {
                        url: bookmark.thumbnail.url
                    };
                }

                return object;
            });

            const bookmarksString = JSON.stringify(plainBookmarks);
            this._localStorage.setItem(this.localStorageKey, bookmarksString);
        } catch (exception) {
            //Fehlerbehandlung
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

        if (!name || typeof name !== 'string') {
            return "Bookmark";
        }

        const existingBookmarks = this.bookmarksArray || [];

        let matchCounter = 0;
        existingBookmarks.forEach(bookmark => {

            if (bookmark && bookmark.name) {

                const bookmarkBaseName = bookmark.name.split("_")[0] || bookmark.name;
                const nameBaseName = name.split("_")[0] || name;

                if (bookmark.name === name || bookmarkBaseName === nameBaseName) {
                    matchCounter++;
                }
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
