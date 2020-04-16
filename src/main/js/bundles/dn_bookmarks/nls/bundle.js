/*
 * Copyright (C) 2020 con terra GmbH (info@conterra.de)
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
module.exports = {
    root: {
        bundleName: "Spatial Bookmarks",
        bundleDescription: "The spatial bookmarks bundle allows to store the extent of the map as several bookmarks.",
        tool: {
            title: "Spatial Bookmarks",
            tooltip: "Spatial Bookmarks"
        },
        ui: {
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            yes: "Yes",
            no: "No",
            removeAllBookmarksQuestion: "Do you really want to delete all spatial bookmarks?",
            removeBookmarkQuestion: "Do you really want to delete this spatial bookmark?",
            createBookmarkFieldLabel: "Enter bookmark name",
            clearAllBookmarks: "Clear All Bookmarks",
            newBookmark: "Add new Bookmark",
            editBookmark: "Edit Bookmark",
            newBookmarkInfo: "After entering a name you can save the new bookmark. The current map section is used as the basis for the position.",
            editBookmarkInfo: "Here you can adjust the name of your spatial bookmark.",
            rules: {
                required: "This value is required!"
            }
        }
    },
    de: true
};
