import { has } from "lodash-es";
import { Hash } from "lucide-vue-next";
import { deleteNode } from "node_modules/@tiptap/core/dist/commands";
import { defineStore } from "pinia";

export const useNotesTreeStore = defineStore("notesTree", {
    state: () => ({
        data: [] as NotesTreeNode[],
        version: '',
        hash: new Map<string, NotesTreeNode>(),
        selectedKeys: [] as string[],
        expandedKeys: [] as string[],
    }),
    getters: {
        allNodes: (state): NotesTreeNode[] => {
            let res = [] as NotesTreeNode[];
            function traverse(node: NotesTreeNode) {
                res.push(node);
                state.hash.set(node.key as string, node);
                if (node.children) {
                    node.children.forEach(traverse);
                }
            }
            state.data.forEach(traverse);
            return res;
        },
    },
    actions: {
        addNote(parent: NotesTreeNode | null): NotesTreeNode {
            const title = `未命名`;
            const key =
                Date.now().toString(36) + Math.random().toString(36).slice(2);
            const isLeaf = true;
            const initialContent = {
                type: "doc",
                content: [
                    {
                        type: "heading",
                        content: [
                            {
                                type: "text",
                                text: "",
                            },
                        ],
                    },
                ],
            };
            if (!parent) {
                const newNoteLeafNode = {
                    title,
                    key,
                    isLeaf,
                    parentKeys: [],
                    content: initialContent,
                };
                this.data.unshift(newNoteLeafNode);
                return newNoteLeafNode;
            }
            const parentKeys = parent.parentKeys
                ? [...parent.parentKeys, parent.key!]
                : [parent.key!];
            const newNoteLeafNode = {
                title,
                key,
                isLeaf,
                parentKeys,
                content: initialContent,
            } as NotesTreeNode;
            if (parent.children) {
                parent.children.unshift(newNoteLeafNode);
            } else {
                parent.children = [newNoteLeafNode];
            }
            return newNoteLeafNode;
        },
        addNotesGroup(parent: NotesTreeNode | null): NotesTreeNode {
            const title = `未命名`;
            const key =
                Date.now().toString(36) + Math.random().toString(36).slice(2);
            const isLeaf = false;
            if (!parent) {
                const newNoteGroupNode = {
                    title,
                    key,
                    isLeaf,
                    parentKeys: [],
                    children: [],
                };
                this.data.unshift(newNoteGroupNode);
                return newNoteGroupNode;
            }
            const parentKeys = parent.parentKeys
                ? [...parent.parentKeys, parent.key!]
                : [parent.key!];
            const newNoteGroupNode = {
                title,
                key,
                isLeaf,
                parentKeys,
                children: [],
            } as NotesTreeNode;
            if (parent.children) {
                parent.children.unshift(newNoteGroupNode);
            } else {
                parent.children = [newNoteGroupNode];
            }
            return newNoteGroupNode;
        },
        deleteNode(
            deleteKey: string,
            siblings: NotesTreeNode[],
            index: number
        ) {
            siblings.splice(index, 1);
            this.hash.delete(deleteKey);
            this.selectedKeys = this.selectedKeys.filter(
                (key) => key !== deleteKey
            );
            this.expandedKeys = this.expandedKeys.filter(
                (key) => key !== deleteKey
            );
        },
    },
});

function createData(level = 4, baseKey = ""): NotesTreeNode[] | undefined {
    if (!level) return undefined;
    return Array(6 - level)
        .fill("")
        .map((_, index) => {
            const key = `${baseKey}${level}${index}`;
            const title = createLabel(level);
            const isLeaf = level === 1;
            const parentKeys = breakdown(baseKey);
            const children = !isLeaf ? createData(level - 1, key) : undefined;
            const content = isLeaf ? {} : undefined;
            return {
                title,
                key,
                isLeaf,
                children,
                parentKeys,
                content,
            };
        });
}

function breakdown(key: string): string[] {
    let res = [] as string[];
    for (let i = 0; i < key.length; i += 2) {
        res.push(key.slice(0, i + 2));
    }
    return res;
}

function createLabel(level: number): string {
    if (level === 4) return "道生一";
    if (level === 3) return "一生二";
    if (level === 2) return "二生三";
    if (level === 1) return "三生万物";
    return "";
}
