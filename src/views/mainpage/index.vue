<template>
    <div class="layout">
        <LeftSiderbar
            :leftBarVisibility="leftBarVisibility"
            @toggle="toggleHandler" />
        <!-- TODO 响应式split实现 -->
        <div class="splitpane">
            <NotesManager
                class="notes-group-list"
                @add-notes="addNotesHandler"
                @locate-note="scrollTo"
                ref="notesGroupList" />
            <NotesTabsView
                class="main"
                @add-notes="addNotesHandler"
                @locate-note="scrollTo" />
        </div>
    </div>
</template>

<script setup lang="ts">
import LeftSiderbar from "@/views/mainpage/left-sidebar/index.vue";
import NotesManager from "@/views/mainpage/notes-manager/index.vue";
import NotesTabsView from "@/views/mainpage/notes-tabs-view/index.vue";
import Split from "split.js";
import { useNotesTabsStore } from "@/store/notesTabs";
import { useNotesTreeStore } from "@/store/notesTree";
const notesTabsStore = useNotesTabsStore();
const notesTreeStore = useNotesTreeStore();
const { data, selectedKeys } = storeToRefs(notesTreeStore);
const { openedNotes, notesKeys, activeNoteName } = storeToRefs(notesTabsStore);

const split = ref();
const leftBarVisibility = ref(true);
const notesManager = useTemplateRef("notesGroupList");

onMounted(() => {
    split.value = Split([".notes-group-list", ".main"], {
        sizes: [18, 82],
        minSize: [300, 500],
        cursor: "ew-resize",
        expandToMin: true,
    });
});

function toggleHandler() {
    leftBarVisibility.value = !leftBarVisibility.value;
    if (leftBarVisibility.value) {
        notesManager.value?.show();
        split.value = Split([".notes-group-list", ".main"], {
            sizes: [18, 82],
            minSize: [300, 500],
            cursor: "ew-resize",
            expandToMin: true,
        });
    } else {
        notesManager.value?.unshow();
        split.value?.setSizes([0, 100]);
        split.value?.collapse(0);
        split.value?.destroy();
    }
}

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


    .splitpane {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex: 1;
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
</style>
