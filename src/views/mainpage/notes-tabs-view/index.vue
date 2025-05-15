<template>
    <div class="main">
        <template v-if="openedNotes.length > 0">
            <el-tabs
                v-model="activeNoteName"
                type="card"
                class="demo-tabs"
                @edit="handleTabsEdit"
                @tab-change="tabChangeHandler"
                closable>
                <el-tab-pane
                    v-for="note in openedNotes"
                    :label="note.title"
                    :name="note.key"
                    :key="note.key">
                    <el-scrollbar class="note-view">
                        <FeatureaBar v-model="drawerVisibiliy" />
                        <Editor
                            v-model:content="note.content!"
                            v-model:title="note.title!"
                            :note-key="note.key!"
                            :version="note.version!" />
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
        </template>
        <template v-else>
            <EmptyState @open-notes-manager="drawerVisibiliy = true">
                <FeatureaBar v-model="drawerVisibiliy" />
            </EmptyState>
        </template>
    </div>
    <n-drawer
        v-if="Capacitor.isNativePlatform()"
        v-model:show="drawerVisibiliy"
        :width="300"
        :auto-focus="false"
        placement="left">
        <slot name="mobileDrawer"></slot>
    </n-drawer>
</template>

<script setup lang="ts">
import { Capacitor } from "@capacitor/core";
import { useModal } from "naive-ui";
import Editor from "@/views/editor/index.vue";
import EmptyState from "./EmptyState.vue";
import FeatureaBar from "./FeatureaBar.vue";
import NotesManager from "@/views/mainpage/notes-manager/index.vue";
import type { TabPaneName } from "element-plus";
import EventEmitter from "@/lib/EventEmitter";
import { useNotesTreeStore } from "@/store/notesTree";
import { useNotesTabsStore } from "@/store/notesTabs";
import { JSONContent } from "@tiptap/core";
import { useNoteApi } from "@/api/note";
import { version } from "vue";
const notesTabsStore = useNotesTabsStore();
const { openedNotes, activeNoteName, openedNotesKeys } =
    storeToRefs(notesTabsStore);
const notesTreeStore = useNotesTreeStore();
const { hash, selectedKeys, expandedKeys } = storeToRefs(notesTreeStore);
const { getNotes, getNoteByKey, updateNotes } = useNoteApi();

const drawerVisibiliy = ref(false);

function tabChangeHandler(targetName: TabPaneName) {
    selectedKeys.value = [targetName as string];
    let option = null;
    if (hash.value.has(targetName as string)) {
        option = hash.value.get(targetName as string)!;
    } else {
        option = openedNotes.value.find((node) => node.key === targetName)!;
    }
    (async function () {
        try {
            const response = await getNoteByKey({ key: targetName as string });
            console.log("获取单个笔记数据成功", response.data);
            option = Object.assign(option, response.data.node);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    })();
    EventEmitter.emit("updateNoteByFetch", option);
}

const handleTabsEdit = (
    targetName: TabPaneName | undefined,
    action: "remove" | "add"
) => {
    if (action === "add") {
        EventEmitter.emit("addNote");
    } else if (action === "remove") {
        const tabs = openedNotes.value;
        let activeName = activeNoteName.value;
        if (activeName === targetName) {
            tabs.forEach((tab, index) => {
                if (tab.key === targetName) {
                    const nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                        activeName = nextTab.key as string;
                    }
                }
            });
        }

        if (activeName === activeNoteName.value) {
            selectedKeys.value = [];
        } else {
            activeNoteName.value = activeName;
            selectedKeys.value = [activeName as string];
        }
        openedNotes.value = tabs.filter((tab) => tab.key !== targetName);
        openedNotesKeys.value.delete(targetName as string);
    }
};
</script>

<style scoped lang="scss">
.main {
    width: 100%;
    height: 100%;
    flex: 1;
    background-color: #ffffff;
    overflow: hidden;
    position: relative;
    z-index: 1;

    .note-view {
        width: 100%;
        height: calc(100vh - var(--top-height));
        overflow: hidden;
        z-index: 1;
    }
}
</style>

<style lang="scss">
.el-tabs__header.is-top {
    --el-color-primary: var(--theme-color);
    max-width: 100%;
    // width: fit-content;
    margin: 0;
    padding-left: 1rem;
    margin-right: 160px;
    border: none;
    z-index: 99;
    justify-content: flex-start;
    user-select: none;
    app-region: drag;

    @media screen and (max-width: 768px) {
        margin-right: 0;
    }

    .el-tabs__nav-wrap.is-top {
        flex-grow: 0;
        app-region: no-drag;
    }

    .el-tabs__new-tab {
        app-region: no-drag;
    }
}
.el-tabs__content {
    border-top: 1px solid var(--el-border-color-light);
}

.n-drawer {
    .n-drawer-content-wrapper {
        border-radius: 8px;
        padding-left: 0;
        padding-right: 0;
        overflow: hidden;
        padding-top: var(--status-bar-height);
    }
}
</style>
