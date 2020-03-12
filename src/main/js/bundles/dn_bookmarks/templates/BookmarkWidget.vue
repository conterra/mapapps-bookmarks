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
    <v-list-tile
        :class="{'bookmark': true, 'success': isActive}"
        @click="emitGoToBookmark()">
        <v-list-tile-action
            v-if="bookmark.thumbnail && bookmark.thumbnail.url"
            class="pr-2">
            <v-img :src="bookmark.thumbnail.url"></v-img>
        </v-list-tile-action>
        <v-list-tile-content>
            <v-list-tile-title>
                {{bookmark.name}}
            </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action v-if="!bookmark.predefined">
            <v-btn
                icon
                @click.stop="emitEditBookmark()">
                <v-icon>edit</v-icon>
            </v-btn>
        </v-list-tile-action>
        <v-list-tile-action v-if="!bookmark.predefined">
            <v-btn
                icon
                @click.stop="emitRemoveBookmark()">
                <v-icon>delete</v-icon>
            </v-btn>
        </v-list-tile-action>
    </v-list-tile>
</template>
<script>
    export default {
        props: {
            bookmark: {
                type: Object,
                default: () => {
                }
            },
            i18n: {
                type: Object,
                default: () => {
                }
            },
            isSelected: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                isActive: false
            }
        },
        watch: {
            isSelected(value) {
                if (value) {
                    //this.isActive = true;
                    setTimeout(() => {
                        //this.isActive = false;
                        // eslint-disable-next-line no-magic-numbers
                    }, 1000);
                }
            }
        },
        methods: {
            emitGoToBookmark() {
                this.$emit('goto-bookmark', this.bookmark);
            },
            emitEditBookmark() {
                this.$emit('edit-bookmark', this.bookmark);
            },
            emitRemoveBookmark() {
                this.$emit('remove-bookmark', this.bookmark);
            }
        }
    }
</script>
