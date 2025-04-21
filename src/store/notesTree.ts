import { defineStore } from 'pinia';

export const useNotesTreeStore = defineStore('notesTree', {
    state: () => ({
        data: createData() as NotesTreeNode[],
        level: 4,
        selectedKeys: [] as string[],
        expandedKeys: [] as string[],
    }),
    getters: {
        allNodes: (state): NotesTreeNode[] => {
            let res = [] as NotesTreeNode[];
            function traverse(node: NotesTreeNode) {
                res.push(node);
                if (node.children) {
                    node.children.forEach(traverse);
                }
            }
            state.data.forEach(traverse);
            return res;
        }
    },
    actions: {
        addNode(node: NotesTreeNode, parentKey: string) {

        },
    }
})

function createData(level = 4, baseKey = ""): NotesTreeNode[] | undefined {
    if (!level) return undefined;
    return Array(6 - level).fill('').map((_, index) => {
        const key = `${baseKey}${level}${index}`;
        const title = createLabel(level);
        const isLeaf = level === 1;
        const parentKeys = breakdown(baseKey);
        const children = !isLeaf ? createData(level - 1, key) : undefined;
        const content = isLeaf ? '' : undefined;
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
        res.push(key.slice(0, i + 2))
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