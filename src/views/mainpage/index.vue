<template>
    <!-- TODO 移动端适配 -->
    <div class="layout" :class="openedNotes.length === 0 ? 'gray' : 'white'">
        <LeftSiderbar
            :leftBarVisibility="leftBarVisibility"
            @toggle="leftBarVisibility = !leftBarVisibility" />
        <Splitpanes class="splitpanes" @resized="storePaneSize">
            <pane
                v-if="leftBarVisibility"
                class="pane1"
                max-size="50"
                :size="paneSize">
                <NotesManager
                    class="notes-group-list"
                    @add-notes="addNotesHandler"
                    @locate-note="scrollTo"
                    ref="notesGroupList" />
            </pane>
            <pane
                class="pane2"
                min-size="50"
                max-size="100"
                :size="100 - paneSize">
                <NotesTabsView
                    class="main"
                    @add-notes="addNotesHandler"
                    @locate-note="scrollTo" />
            </pane>
        </Splitpanes>
    </div>
</template>

<script setup lang="ts">
import LeftSiderbar from "@/views/mainpage/left-sidebar/index.vue";
import NotesManager from "@/views/mainpage/notes-manager/index.vue";
import NotesTabsView from "@/views/mainpage/notes-tabs-view/index.vue";
import { Splitpanes, Pane } from "splitpanes";
import { useStorage } from "@vueuse/core";
import { useNotesTabsStore } from "@/store/notesTabs";
import { useNotesTreeStore } from "@/store/notesTree";
const notesTabsStore = useNotesTabsStore();
const notesTreeStore = useNotesTreeStore();
const { data, selectedKeys } = storeToRefs(notesTreeStore);
const { openedNotes, notesKeys, activeNoteName } = storeToRefs(notesTabsStore);

const leftBarVisibility = ref(true);
const notesManager = useTemplateRef("notesGroupList");
const paneSize = useStorage("paneSize", 20);

const storePaneSize = ({ prevPane }: { prevPane: { size: number } }) => {
    paneSize.value = prevPane.size;
};

function scrollTo(option: NotesTreeNode) {
    notesManager.value?.tree?.scrollTo(option);
}

let i = 2;
function addNotesHandler() {
    const title = `未命名`;
    const key = `4${++i}`;
    const isLeaf = true;
    openedNotes.value.push({
        title: "未命名",
        key,
        content: `<h1>未命名</h1>`,
    });
    notesKeys.value.add(key);
    activeNoteName.value = key;
    selectedKeys.value = [key];
    data.value.push({
        title,
        key,
        isLeaf,
        parentKeys: [],
        content: "<h1>未命名</h1>",
    });
}
</script>

<style scoped lang="scss">
.layout {
    height: 100%;
    margin-top: 8px;
    display: flex;
    flex-direction: row;

    &.gray {
        background-color: #f5f5f5;
    }
    &.white {
        background-color: #ffffff;
    }

    .splitpanes {
        width: calc(100% - var(--leftbar-width));
        height: 100%;
        display: flex;
        flex-direction: row;
        flex: 1 0;

        .pane1 {
            min-width: 250px;
        }

        .pane2 {
            min-width: 500px;
        }
    }
}
</style>

<style lang="scss">
.gutter {
    height: 100vh;
    width: 1px !important;
    background: var(--gray-3);
    background-repeat: no-repeat;
    background-position: 50%;
    cursor: ew-resize;
    outline: 1px solid transparent;
    transition: 0.3s ease-in-out;
    position: relative;
    top: -8px;
    z-index: 999;

    &.gutter-horizontal {
        // background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
        float: left;
    }

    &:hover {
        outline: 1px solid var(--theme-color);
        background: var(--theme-color);
    }

    &::after {
        content: "";
        position: absolute;
        height: 100%;
        left: -5px;
        right: -10px;
        z-index: 10;
        background: transparent;
        cursor: ew-resize;
        pointer-events: all;
        /* 关键：允许伪元素响应鼠标事件 */
    }
}

.splitpanes__splitter {
    height: 100vh;
    background-color: #ccc;
    outline: 1px solid transparent;
    transition: 0.3s ease-in-out;
    cursor: ew-resize !important;
    position: relative;
    top: -8px;
    z-index: 999;

    &:hover {
        outline: 1px solid var(--theme-color);
        background-color: var(--theme-color);
    }
}
.splitpanes__splitter:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    transition: opacity 0.4s;
    // background-color: var(--theme-color);
    // outline: 1px solid transparent;
    opacity: 0;
    z-index: 1;
}
.splitpanes__splitter:hover:before {
    opacity: 1;
}
.splitpanes--vertical > .splitpanes__splitter:before {
    left: -10px;
    right: -5px;
    height: 100%;
}
</style>
