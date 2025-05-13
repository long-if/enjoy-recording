<template>
    <div class="notes-group-list">
        <div class="options">
            <div class="icon-box" @click="addNote(null)">
                <file-addition theme="outline" size="18" fill="#333" />
            </div>
            <div class="icon-box" @click="addNotesGroup(null)">
                <folder-plus
                    class="icon"
                    theme="outline"
                    size="18"
                    fill="#333" />
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
                <afferent class="icon" theme="outline" size="18" fill="#333" />
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
                :render-label="renderLabel"
                :expanded-keys="expandedKeys"
                :selected-keys="selectedKeys"
                :render-switcher-icon="renderSwitcherIcon"
                :override-default-node-click-behavior="override"
                :node-props="nodeProps"
                @drop="handleDrop"
                @update:expanded-keys="handleExpandedKeysChange" />
            <n-dropdown
                trigger="manual"
                placement="bottom-start"
                size="small"
                :show="showDropdown"
                :options="options"
                :x="x"
                :y="y"
                @select="handleSelect"
                @clickoutside="handleClickoutside" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from "./icon.vue";
import type {
    TreeDropInfo,
    TreeOption,
    TreeOverrideNodeClickBehavior,
    NTree,
    DropdownOption,
} from "naive-ui";
import { NInput, useMessage } from "naive-ui";
import {
    Afferent,
    Aiming,
    FileAddition,
    FolderPlus,
    FolderOpen,
    Export,
    AddWeb,
    MinusTheTop,
    Star,
    Delete,
    Edit,
    EditOne,
} from "@icon-park/vue-next";
import { useNoteApi } from "@/api/note";
import EventEmitter from "@/lib/EventEmitter";
import { useNotesTreeStore } from "@/store/notesTree";
import { useNotesTabsStore } from "@/store/notesTabs";
import { Folder } from "lucide-vue-next";
const notesTreeStore = useNotesTreeStore();
const { data, selectedKeys, expandedKeys } = storeToRefs(notesTreeStore);
const notesTabsStore = useNotesTabsStore();
const { openedNotes, notesKeys, activeNoteName } = storeToRefs(notesTabsStore);
const { getNotes, getNoteByKey, updateNotes } = useNoteApi();
const editInput = useTemplateRef<HTMLElement>("editInput");
const tree = useTemplateRef("tree");
const message = useMessage();
const showDropdown = ref(false);
const x = ref(0);
const y = ref(0);
const options = ref<DropdownOption[]>([]);
let selectedOptionFromDropDown = ref<NotesTreeNode | null>(null);
// 编辑状态
const editingKey = ref<string | undefined>();
const editValue = ref("");
const notesOptions = ref([
    {
        label: "移动",
        key: "move",
        icon: renderIcon(MinusTheTop),
    },
    {
        label: "导出",
        key: "export",
        icon: renderIcon(Export),
    },
    {
        label: "在新窗口打开",
        key: "openNewWindow",
        icon: renderIcon(AddWeb),
    },
    {
        label: "收藏",
        key: "star",
        icon: renderIcon(Star),
    },
    {
        key: 1,
        type: "divider",
        show: true,
    },
    {
        label: "重命名",
        key: "rename",
        icon: renderIcon(Edit),
        props: {
            onClick: () => {
                const option = selectedOptionFromDropDown.value;
                if (option) {
                    // 进入编辑模式
                    editingKey.value = option.key as string;
                    editValue.value = option.title!;
                }
            },
        },
    },
    {
        label: "删除",
        key: "delete",
        icon: renderIcon(Delete),
        props: {
            onClick: () => {
                const option = selectedOptionFromDropDown.value;
                if (option) {
                    notesTreeStore.deleteNode(option);
                    notesTabsStore.deleteTab(option);
                    EventEmitter.emit("updateNotesTree");
                }
            },
        },
    },
]);
const notesGroupOptions = ref([
    {
        label: "新建笔记",
        key: "addNote",
        icon: renderIcon(FileAddition),
        props: {
            onClick: () => {
                const option = selectedOptionFromDropDown.value;
                if (option) {
                    if (!expandedKeys.value.includes(option.key as string))
                        expandedKeys.value.push(option.key! as string);
                    addNote(option);
                }
            },
        },
    },
    {
        label: "新建分组",
        key: "addNotesGroup",
        icon: renderIcon(FolderOpen),
        props: {
            onClick: () => {
                const option = selectedOptionFromDropDown.value;
                if (option) {
                    if (!expandedKeys.value.includes(option.key as string))
                        expandedKeys.value.push(option.key! as string);
                    addNotesGroup(option);
                }
            },
        },
    },
    {
        key: 1,
        type: "divider",
        show: true,
    },
    {
        label: "移动",
        key: "move",
        icon: renderIcon(MinusTheTop),
    },
    {
        label: "导出",
        key: "export",
        icon: renderIcon(Export),
    },
    {
        label: "在新窗口打开",
        key: "openNewWindow",
        icon: renderIcon(AddWeb),
    },
    {
        label: "收藏",
        key: "star",
        icon: renderIcon(Star),
    },
    {
        key: 2,
        type: "divider",
        show: true,
    },
    {
        label: "重命名",
        key: "rename",
        icon: renderIcon(Edit),
        props: {
            onClick: () => {
                const option = selectedOptionFromDropDown.value;
                if (option) {
                    // 进入编辑模式
                    editingKey.value = option.key as string;
                    editValue.value = option.title!;
                }
            },
        },
    },
    {
        label: "删除",
        key: "delete",
        icon: renderIcon(Delete),
        props: {
            onClick: () => {
                const option = selectedOptionFromDropDown.value;
                if (option) {
                    notesTreeStore.deleteNode(option);
                    notesTabsStore.deleteTab(option);
                    EventEmitter.emit("updateNotesTree");
                }
            },
        },
    },
]);

const emit = defineEmits<{
    (e: "addNote"): void;
    (e: "addNotesGroup"): void;
    (e: "locateNote", option: NotesTreeNode): void;
}>();

defineExpose({
    tree,
});

function addNote(parent: NotesTreeNode | null) {
    const newNode = notesTreeStore.addNote(parent);
    notesTabsStore.addTab(newNode);
    EventEmitter.emit("updateNotesTree");
}

function addNotesGroup(parent: NotesTreeNode | null) {
    const newNode = notesTreeStore.addNotesGroup(parent);
    selectedOptionFromDropDown.value = newNode;
    // 进入编辑模式
    editingKey.value = newNode.key as string;
    editValue.value = newNode.title!;
}

function renderIcon(icon: Component) {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon),
        });
    };
}

function locate() {
    const option = notesTreeStore.allNodes.find(
        (node) => node.key === selectedKeys.value[0]
    );
    if (option) {
        expandedKeys.value.push(...option?.parentKeys!);
        emit("locateNote", option);
    }
}

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

const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
        onContextmenu(e: MouseEvent): void {
            selectedOptionFromDropDown.value = option;
            if (option.isLeaf) {
                options.value = notesOptions.value;
            } else {
                options.value = notesGroupOptions.value;
            }
            showDropdown.value = true;
            x.value = e.clientX;
            y.value = e.clientY;
            e.preventDefault();
        },
    };
};

function renderLabel({ option }: { option: TreeOption }) {
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "Enter") saveEdit();
        if (e.key === "Escape") {
            selectedOptionFromDropDown.value!.disabled = false;
            editingKey.value = undefined;
            editValue.value = "";
        }
    };
    if (option.key === editingKey.value) {
        option.disabled = true;
        return h(NInput, {
            autofocus: true,
            ref: "editInput",
            size: "tiny",
            value: editValue.value,
            onUpdateValue: (v) => (editValue.value = v),
            onBlur: saveEdit,
            onKeyup: handleKeyUp,
        });
    }
    return `${option.title}`;
}

// 保存修改
const saveEdit = () => {
    if (!editingKey.value) return;
    editValue.value = editValue.value.trim();
    if (!editValue.value) {
        message.error("名称不能为空");
        editValue.value = selectedOptionFromDropDown.value!.title!;
        return;
    } else if (editValue.value === selectedOptionFromDropDown.value!.title) {
    } else {
        selectedOptionFromDropDown.value!.title = editValue.value;
        if (selectedOptionFromDropDown.value!.isLeaf) {
            EventEmitter.emit(
                "updateNoteTitle",
                selectedOptionFromDropDown.value!.key,
                selectedOptionFromDropDown.value!.title
            );
        }
        EventEmitter.emit("updateNotesTree");
    }
    selectedOptionFromDropDown.value!.disabled = false;
    editingKey.value = undefined;
};

const handleSelect = (key: string | number, option: DropdownOption) => {
    showDropdown.value = false;
};

const handleClickoutside = () => {
    showDropdown.value = false;
};

const renderSwitcherIcon = () => h(NIcon, null, { default: () => h(Icon) });

// @ts-ignore
const override: TreeOverrideNodeClickBehavior = async ({ option }) => {
    if (!option.isLeaf && option.key !== editingKey.value) {
        return "toggleExpand";
    }
    if (option.isLeaf && option.key !== editingKey.value) {
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
    }
    return "none";
};

function addTabs(option: NotesTreeNode) {
    if (notesKeys.value.has(option.key! as string)) {
        activeNoteName.value = option.key! as string;
        selectedKeys.value = [option.key! as string];
        EventEmitter.emit("updateNoteByFetch", option);
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

.n-dropdown-menu.n-popover-shared.n-dropdown {
    border-radius: 8px;

    .n-dropdown-option {
        border-radius: 4px;
        .n-dropdown-option-body {
            padding: 0 8px;
        }
    }
}
</style>
