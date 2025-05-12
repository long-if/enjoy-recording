<template>
    <div class="notes-group-list" ref="notesGroupList">
        <div class="options">
            <div class="icon-box" @click="emit('addNote')">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-xinjianwendang"></use>
                </svg>
            </div>
            <div class="icon-box" @click="emit('addNotesGroup')">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-tianjiafenzu"></use>
                </svg>
            </div>
            <div class="icon-box" @click="toggleExpand">
                <svg class="icon" aria-hidden="true">
                    <use
                        :xlink:href="
                            expandedKeys.length !== 0
                                ? '#icon-shouqi1'
                                : '#icon-zhankai'
                        "></use>
                </svg>
            </div>
            <div class="icon-box" @click="locate">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dingwei1"></use>
                </svg>
            </div>
            <div class="icon-box">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-daoruwendang2"></use>
                </svg>
            </div>
        </div>
        <div class="notes">
            <n-tree
                ref="tree"
                block-line
                show-line
                draggable
                virtual-scroll
                selectable
                expand-on-dragenter
                expand-on-click
                label-field="title"
                :data="data"
                :expanded-keys="expandedKeys"
                :selected-keys="selectedKeys"
                :render-switcher-icon="renderSwitcherIcon"
                :override-default-node-click-behavior="override"
                @drop="handleDrop"
                @update:expanded-keys="handleExpandedKeysChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from "./icon.vue";
import {
    FileTrayFullOutline as File,
    Folder as Folder,
    FolderOpenOutline as FolderOpened,
} from "@vicons/ionicons5";
import type {
    TreeDropInfo,
    TreeOption,
    TreeOverrideNodeClickBehavior,
    NTree,
} from "naive-ui";
import { useNoteApi } from "@/api/note";
import EventEmitter from "@/lib/EventEmitter";
import { useNotesTreeStore } from "@/store/notesTree";
import { useNotesTabsStore } from "@/store/notesTabs";
const notesTreeStore = useNotesTreeStore();
const { data, selectedKeys, expandedKeys } = storeToRefs(notesTreeStore);
const notesTabsStore = useNotesTabsStore();
const { openedNotes, notesKeys, activeNoteName } = storeToRefs(notesTabsStore);
const notesManager = useTemplateRef<HTMLElement>("notesGroupList");
const tree = useTemplateRef("tree");
const { getNotes, getNoteByKey, updateNotes } = useNoteApi();
const emit = defineEmits<{
    (e: "addNote"): void;
    (e: "addNotesGroup"): void;
    (e: "locateNote", option: NotesTreeNode): void;
}>();

function locate() {
    const option = notesTreeStore.allNodes.find(
        (node) => node.key === selectedKeys.value[0]
    );
    if (option) {
        expandedKeys.value.push(...option?.parentKeys!);
        emit("locateNote", option);
    }
}

defineExpose({
    tree,
});

const willExpand = ref(false);
function toggleExpand() {
    willExpand.value = expandedKeys.value.length === 0;
    const noLeafNodes = notesTreeStore.allNodes.filter((node) => !node.isLeaf);
    if (willExpand.value) {
        expandedKeys.value = noLeafNodes.map((node) => node.key! as string);
    } else {
        expandedKeys.value = [];
    }
}

const renderSwitcherIcon = () => h(NIcon, null, { default: () => h(Icon) });

// @ts-ignore
const override: TreeOverrideNodeClickBehavior = async ({ option }) => {
    if (option.children) {
        return "toggleExpand";
    }
    // let noteTab = notesTreeStore.allNodes.find((node) => node.key === option.key)!;
    try {
        const response = await getNoteByKey({ key: option.key! as string });
        console.log("获取单个笔记数据成功", response.data);
        option = Object.assign(option, response.data.node);
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
    addTabs(option);
    return "default";
};

function addTabs(option: NotesTreeNode) {
    if (notesKeys.value.has(option.key! as string)) {
        activeNoteName.value = option.key! as string;
        selectedKeys.value = [option.key! as string];
        EventEmitter.emit("updateNoteByFetch", option.content);
        return;
    }
    openedNotes.value.push(option);
    notesKeys.value.add(option.key! as string);
    activeNoteName.value = option.key! as string;
    selectedKeys.value = [option.key! as string];
}

function findSiblingsAndIndex(
    node: TreeOption,
    nodes?: TreeOption[]
): [TreeOption[], number] | [null, null] {
    if (!nodes) return [null, null];
    for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i];
        if (siblingNode.key === node.key) return [nodes, i];
        const [siblings, index] = findSiblingsAndIndex(
            node,
            siblingNode.children
        );
        if (siblings && index !== null) return [siblings, index];
    }
    return [null, null];
}

function handleExpandedKeysChange(
    currentExpandedKeys: string[],
    _option: Array<TreeOption | null>,
    meta: {
        node: TreeOption | null;
        action: "expand" | "collapse" | "filter";
    }
) {
    expandedKeys.value = currentExpandedKeys;
}
// BUG 拖拽后parentKeys未更新
function handleDrop({ node, dragNode, dropPosition }: TreeDropInfo) {
    const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
        dragNode,
        data.value
    );
    if (dragNodeSiblings === null || dragNodeIndex === null) return;
    dragNodeSiblings.splice(dragNodeIndex, 1);
    if (dropPosition === "inside") {
        if (node.children) {
            node.children.unshift(dragNode);
        } else {
            node.children = [dragNode];
        }
    } else if (dropPosition === "before") {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
            node,
            data.value
        );
        if (nodeSiblings === null || nodeIndex === null) return;
        nodeSiblings.splice(nodeIndex, 0, dragNode);
    } else if (dropPosition === "after") {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
            node,
            data.value
        );
        if (nodeSiblings === null || nodeIndex === null) return;
        nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
    }
    data.value = Array.from(data.value);
}
</script>

<style lang="scss" scoped>
.notes-group-list {
    display: flex;
    flex-direction: column;
    z-index: 1;
    position: relative;

    .options {
        --box-size: 30px;
        --size: 18px;
        height: var(--top-height);
        box-sizing: content-box;
        flex-shrink: 0;
        background-color: white;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 8px;
        border-bottom: 1px solid var(--gray-3);

        .icon-box {
            width: var(--box-size);
            height: var(--box-size);
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            app-region: no-drag;

            &:hover {
                cursor: pointer;
                background-color: #eff0f0;
            }

            .icon {
                width: var(--size);
                height: var(--size);
                transition: all 0.2s ease;
                position: relative;
                z-index: 2;
            }
        }
    }

    .notes {
        width: 100%;
        height: 100%;
        background-color: white;
    }
}
</style>

<style lang="scss">
.n-tree {
    --n-font-size: 14px;
    height: calc(100vh - var(--top-height));
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 1rem;
}

.v-vl {
    --n-node-color-active: rgba(160, 85, 24, 0.1) !important;
}
.n-tree-node-content__text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
