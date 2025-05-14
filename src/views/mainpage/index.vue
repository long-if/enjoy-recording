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
                max-size="40"
                :size="paneSize">
                <NotesManager
                    class="notes-group-list"
                    @locate-note="scrollTo"
                    ref="notesGroupList" />
            </pane>
            <pane
                class="pane2"
                min-size="50"
                max-size="100"
                :size="100 - paneSize">
                <NotesTabsView class="main" />
            </pane>
        </Splitpanes>
    </div>
</template>

<script setup lang="ts">
import LeftSiderbar from "@/views/mainpage/left-sidebar/index.vue";
import NotesManager from "@/views/mainpage/notes-manager/index.vue";
import NotesTabsView from "@/views/mainpage/notes-tabs-view/index.vue";
import { useModal, useDialog } from "naive-ui";
import { Splitpanes, Pane } from "splitpanes";
import { debounce, throttle } from "lodash-es";
import { useStorage } from "@vueuse/core";
import { useNoteApi } from "@/api/note";
import { useNotesTabsStore } from "@/store/notesTabs";
import { useNotesTreeStore } from "@/store/notesTree";
import EventEmitter from "@/lib/EventEmitter";
const notesTabsStore = useNotesTabsStore();
const notesTreeStore = useNotesTreeStore();
const { data, hash, selectedKeys, expandedKeys } = storeToRefs(notesTreeStore);
const { openedNotes, notesKeys, activeNoteName } = storeToRefs(notesTabsStore);

const leftBarVisibility = ref(true);
const notesManager = useTemplateRef("notesGroupList");
const paneSize = useStorage("paneSize", 20);
const { getNotes, getNoteByKey, updateNotes, updateNoteByKey } = useNoteApi();
// const modal = useModal();
let dialog = useDialog();
let timer: NodeJS.Timeout;

onMounted(async () => {
    try {
        const response = await getNotes();
        console.log("获取笔记数据成功", response.data);
        data.value = response.data.notes_tree;
    } catch (error) {
        console.error("Error fetching notes:", error);
    }

    // TODO : 笔记树结构多端同步实现
    // async function checkLatest() {
    //     try {
    //         const response = await getNotes();
    //         console.log("笔记树更新");
    //         data.value = response.data.notes_tree;
    //     } catch (error) {
    //         console.error("Error fetching notes:", error);
    //     } finally {
    //         timer = setTimeout(checkLatest, 3000);
    //     }
    // }

    // timer = setTimeout(checkLatest, 3000);
});

// onUnmounted(() => {
//     clearTimeout(timer);
// });

const storePaneSize = ({ prevPane }: { prevPane: { size: number } }) => {
    paneSize.value = prevPane.size;
};

function scrollTo(option: NotesTreeNode) {
    notesManager.value?.tree?.scrollTo(option);
}

const syncNotesTree = async () => {
    try {
        const response = await updateNotes({ notes_tree: data.value });
        console.log("同步笔记树结构成功", response.data);
    } catch (error) {
        console.error("Error syncing notes:", error);
    }
};
const updateNotesTree = throttle(syncNotesTree, 500, {
    leading: false,
    trailing: true,
});
EventEmitter.on("updateNotesTree", updateNotesTree);

const syncNote = async (noteData: { key: string; nodeData: object }) => {
    try {
        const response = await updateNoteByKey({
            key: noteData.key,
            nodeData: noteData.nodeData,
        });
        let option = null;
        if (hash.value.has(noteData.key)) {
            option = hash.value.get(noteData.key)!;
        } else {
            option = openedNotes.value.find(
                (node) => node.key === noteData.key
            )!;
        }
        option = Object.assign(option, response.data.node);
        console.log("同步单个笔记数据成功", response.data);
    } catch (error) {
        console.error("Error syncing note:", error);
    }
};
const updateNote = throttle(syncNote, 3000, {
    leading: false,
    trailing: true,
});
EventEmitter.on("updateNote", updateNote);
EventEmitter.on("conflict", () => {
    dialog.info({
        title: "当前文档内容有更新!",
        content: "请基于最新内容进行编辑",
        closable: false,
        maskClosable: false,
        positiveText: "确认",
        onPositiveClick: async () => {
            try {
                const response = await getNoteByKey({
                    key: activeNoteName.value as string,
                });
                console.log("获取最新笔记数据成功", response.data);
                let option = openedNotes.value.find(
                    (node) => node.key === activeNoteName.value
                )!;
                option = Object.assign(option, response.data.node);
                EventEmitter.emit("updateNoteByFetch", option);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        },
        style: {},
    });
});
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
