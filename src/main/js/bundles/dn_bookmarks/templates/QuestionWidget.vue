<!--

    Copyright (C) 2023 con terra GmbH (info@conterra.de)

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
        fill-height
    >
        <v-layout column>
            <v-flex style="overflow-y:auto;">
                <v-alert
                    :value="true"
                    type="warning"
                >
                    {{ question }}
                </v-alert>
            </v-flex>
            <v-flex shrink>
                <v-layout
                    row
                    wrap
                >
                    <v-flex class="pr-1">
                        <v-btn
                            block
                            class="mb-0"
                            color="secondary"
                            @click="$emit('no')"
                        >
                            <v-icon left>
                                clear
                            </v-icon>
                            {{ i18n.no }}
                        </v-btn>
                    </v-flex>
                    <v-flex class="pl-1">
                        <v-btn
                            block
                            class="mb-0"
                            color="primary"
                            @click="$emit('yes')"
                        >
                            <v-icon left>
                                done
                            </v-icon>
                            {{ i18n.yes }}
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
            question: {
                type: String,
                default: () => ""
            },
            i18n: {
                type: Object,
                default: () => {
                }
            }
        }
    };
</script>
