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
            <div class="icon-box clear-tabs" @click="notesTabsStore.clearTabs">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-guanbiquanbubiaoqianye1"></use>
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
import { Capacitor } from "@capacitor/core";
import Icon from "./icon.vue";
import type {
    TreeDropInfo,
    TreeOption,
    TreeOverrideNodeClickBehavior,
    NTree,
    DropdownOption,
} from "naive-ui";
import { NInput, useMessage, darkTheme } from "naive-ui";
import { JSONContent } from "@tiptap/core";
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
import { Key } from "naive-ui/es/tree/src/interface";
const notesTreeStore = useNotesTreeStore();
const { data, hash, selectedKeys, expandedKeys } = storeToRefs(notesTreeStore);
const notesTabsStore = useNotesTabsStore();
const { openedNotes, openedNotesKeys, activeNoteName } =
    storeToRefs(notesTabsStore);
const { getNotes, getNoteByKey, updateNotes } = useNoteApi();
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
                    let [siblings, index] = findSiblingsAndIndex(option);
                    notesTreeStore.deleteNode(
                        option.key as string,
                        siblings,
                        index
                    );
                    notesTabsStore.deleteTab(option.key as string);
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
        label: "导入",
        key: "import",
        icon: renderIcon(Afferent),
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
                    let [siblings, index] = findSiblingsAndIndex(option);
                    notesTreeStore.deleteNode(
                        option.key as string,
                        siblings,
                        index
                    );
                    notesTabsStore.deleteTab(option.key as string);
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
    hash.value.set(newNode.key! as string, newNode);
    EventEmitter.emit("updateNotesTree");
}
EventEmitter.on("addNote", (parent: NotesTreeNode | null) => {
    addNote(parent);
});

function addNotesGroup(parent: NotesTreeNode | null) {
    const newNode = notesTreeStore.addNotesGroup(parent);
    hash.value.set(newNode.key! as string, newNode);
    selectedOptionFromDropDown.value = newNode;
    // 进入编辑模式
    editingKey.value = newNode.key as string;
    editValue.value = newNode.title!;
}

function renderIcon(icon: Component) {
    return () => {
        return h(
            NIcon,
            {
                style: {
                    translate: Capacitor.isNativePlatform() ? "0 -2px" : 'none',
                },
            },
            {
                default: () => h(icon),
            }
        );
    };
}

function locate() {
    let option = null;
    if (hash.value.has(activeNoteName.value)) {
        option = hash.value.get(activeNoteName.value)!;
    } else {
        option = notesTreeStore.allNodes.find(
            (node) => node.key === activeNoteName.value
        )!;
    }
    if (option) {
        expandedKeys.value.push(...option.parentKeys!);
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

const inputRef = ref<HTMLInputElement | null>(null);
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
        nextTick(() => {
            const input = inputRef.value;
            if (input) {
                input.focus();
            }
        });
        return h(NInput, {
            autofocus: true,
            ref: inputRef,
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
            if (
                openedNotesKeys.value.has(
                    selectedOptionFromDropDown.value!.key! as string
                )
            ) {
                EventEmitter.emit(
                    "updateNoteTitle",
                    selectedOptionFromDropDown.value!.key,
                    selectedOptionFromDropDown.value!.title
                );
            } else {
                const newContent = selectedOptionFromDropDown.value!.content;
                const newTitle = selectedOptionFromDropDown.value!.title;
                const titleNode = newContent?.content?.find(
                    (node) => node?.type === "heading"
                ) as JSONContent;
                const titleContent = titleNode?.content;
                if (titleContent) {
                    titleContent[0].text = newTitle;
                } else {
                    titleNode.content = [
                        {
                            type: "text",
                            text: newTitle,
                        },
                    ];
                }
                selectedOptionFromDropDown.value!.content = newContent;
                EventEmitter.emit("updateNotesTree");
            }
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

const renderSwitcherIcon = () =>
    h(
        NIcon,
        {
            size: Capacitor.isNativePlatform() ? 16 : 14,
        },
        {
            default: () => h(Icon),
        }
    );

// @ts-ignore
const override: TreeOverrideNodeClickBehavior = async ({ option }) => {
    if (!option.isLeaf && option.key !== editingKey.value) {
        return "toggleExpand";
    }
    if (option.isLeaf && option.key !== editingKey.value) {
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
    if (openedNotesKeys.value.has(option.key! as string)) {
        activeNoteName.value = option.key! as string;
        selectedKeys.value = [option.key! as string];
        EventEmitter.emit("updateNoteByFetch", option);
        return;
    }
    openedNotes.value.push(option);
    openedNotesKeys.value.add(option.key! as string);
    activeNoteName.value = option.key! as string;
    selectedKeys.value = [option.key! as string];
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

function findSiblingsAndIndex(node: NotesTreeNode): [NotesTreeNode[], number] {
    let nodeDirctParent = null,
        nodeSiblings = null,
        nodeIndex = null;
    if (node.parentKeys?.length) {
        const nodeDirctParentKey = node.parentKeys[node.parentKeys.length - 1];
        if (hash.value.has(nodeDirctParentKey)) {
            nodeDirctParent = hash.value.get(nodeDirctParentKey)!;
        } else {
            nodeDirctParent = notesTreeStore.allNodes.find(
                (node) => node.key === nodeDirctParentKey
            )!;
        }
        nodeSiblings = nodeDirctParent.children!;
        nodeIndex = nodeSiblings.findIndex((item) => item.key === node.key);
    } else {
        nodeSiblings = data.value;
        nodeIndex = nodeSiblings.findIndex((item) => item.key === node.key);
    }
    return [nodeSiblings, nodeIndex];
}

function handleDrop({
    node,
    dragNode,
    dropPosition,
}: TreeDropInfo & { node: NotesTreeNode; dragNode: NotesTreeNode }) {
    const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(dragNode);
    if (dragNodeSiblings === null || dragNodeIndex === null) return;

    // 从原位置移除节点
    dragNodeSiblings.splice(dragNodeIndex, 1);

    // 更新节点及其所有子节点的parentKeys
    const updateParentKeys = (node: NotesTreeNode, newParentKeys: string[]) => {
        node.parentKeys = newParentKeys;
        if (node.children) {
            node.children.forEach((child) => {
                updateParentKeys(child, [
                    ...newParentKeys,
                    node.key! as string,
                ]);
            });
        }
    };

    if (dropPosition === "inside") {
        if (node.children) {
            node.children.unshift(dragNode);
        } else {
            node.children = [dragNode];
        }
        // 更新被拖拽节点及其所有子节点的parentKeys
        const newParentKeys = [...(node.parentKeys || []), node.key! as string];
        updateParentKeys(dragNode, newParentKeys);
    } else if (dropPosition === "before") {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node);
        if (nodeSiblings === null || nodeIndex === null) return;
        nodeSiblings.splice(nodeIndex, 0, dragNode);
        // 更新被拖拽节点及其所有子节点的parentKeys
        updateParentKeys(dragNode, [...(node.parentKeys || [])]);
    } else if (dropPosition === "after") {
        const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node);
        if (nodeSiblings === null || nodeIndex === null) return;
        nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
        // 更新被拖拽节点及其所有子节点的parentKeys
        updateParentKeys(dragNode, [...(node.parentKeys || [])]);
    }
    // data.value = Array.from(data.value);
    EventEmitter.emit("updateNotesTree");
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

        @media screen and (max-width: 768px) {
            border-top: 1px solid var(--gray-3);
        }

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
                @media screen and (min-width: 768px) {
                    cursor: pointer;
                    background-color: #eff0f0;
                }
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

    @media screen and (max-width: 768px) {
        --n-font-size: 16px;
        height: calc(
            100vh - var(--top-height) - var(--status-bar-height) - 108px
        );
        padding-top: 4px;
        padding-bottom: 0.5rem;
    }

    .v-vl {
        --n-node-color-active: rgba(160, 85, 24, 0.1) !important;

        @media screen and (max-width: 768px) {
            --n-node-content-height: 30px !important;
            --n-node-wrapper-padding: 4px 0 !important;
            --n-node-border-radius: 4px !important;
        }
    }

    .n-tree-node-switcher .n-tree-node-switcher__icon {
        @media screen and (max-width: 768px) {
            width: 16px !important;
            height: 16px !important;
        }
    }
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
