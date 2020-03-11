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
    <v-container
        class="pa-0"
        fluid
        fill-height>
        <v-layout column>
            <v-flex style="overflow-y:auto;">
                <div>{{ i18n.editBookmark }}</div>
                <v-alert
                    :value="true"
                    type="info"
                >
                    {{ i18n.editBookmarkInfo }}
                </v-alert>
                <v-text-field
                    v-model="bookmarkName"
                    required
                    autofocus
                    clearable
                    hide-details
                    :rules="[rules.required]"
                    :label="i18n.createBookmarkFieldLabel"
                    @keyup.enter="saveBookmark()"
                    @keyup.esc="cancel()">
                </v-text-field>
            </v-flex>
            <v-flex shrink>
                <v-layout
                    row
                    wrap>
                    <v-flex md12>
                        <v-btn
                            block
                            outline
                            color="error"
                            @click="removeBookmark()">
                            <v-icon left>
                                delete
                            </v-icon>
                            {{ i18n.delete }}
                        </v-btn>
                    </v-flex>
                    <v-flex class="pr-1">
                        <v-btn
                            block
                            class="mb-0"
                            @click="cancel()"
                            color="secondary">
                            <v-icon left>
                                clear
                            </v-icon>
                            {{ i18n.cancel }}
                        </v-btn>
                    </v-flex>
                    <v-flex class="pl-1">
                        <v-btn
                            block
                            class="mb-0"
                            color="primary"
                            :disabled="!bookmarkNameIsValid"
                            @click="saveBookmark()">
                            <v-icon left>
                                save
                            </v-icon>
                            {{ i18n.save }}
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
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
            }
        },
        data: function () {
            return {
                bookmarkName: this.bookmark.name || "",
                rules: {
                    required: (value) => !!value || this.i18n.rules.required
                }
            }
        },
        computed: {
            bookmarkNameIsValid() {
                return this.bookmarkName !== null
                    && this.bookmarkName !== undefined
                    && this.bookmarkName.trim() !== "";
            }
        },
        methods: {
            cancel() {
                this.$emit('cancel');
                this.bookmarkName = null;
                this.bookmark = null;
            },
            saveBookmark() {
                if (this.bookmarkNameIsValid) { // validity check for enter key
                    let name = this.bookmarkName;
                    this.$emit('save-bookmark', this.bookmark, name);
                    this.bookmarkName = null;
                    this.bookmark = null;
                }
            },
            removeBookmark() {
                this.$emit('remove-bookmark', this.bookmark);
                this.bookmarkName = null;
                this.bookmark = null;
            }
        }
    }
</script>
