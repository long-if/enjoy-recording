import { defineStore } from "pinia";
import { useNotesTreeStore } from "@/store/notesTree";
import { add } from "lodash-es";

export const useNotesTabsStore = defineStore("notesTabs", {
    state: () => ({
        openedNotes: [] as NotesTreeNode[],
        notesKeys: new Set<string>(),
        activeNoteName: "",
    }),
    actions: {
        findInNotesTree(key: string) {
            const notesTreeStore = useNotesTreeStore();
            return notesTreeStore.allNodes.find((node) => node.key === key);
        },
        addTab(node: NotesTreeNode) {
            const notesTreeStore = useNotesTreeStore();
            this.openedNotes.push(node);
            this.notesKeys.add(node.key as string);
            this.activeNoteName = node.key as string;
            notesTreeStore.selectedKeys = [node.key as string];
        },
        deleteTab(key: string) {
            this.openedNotes = this.openedNotes.filter(
                (item) => item.key !== key
            );
            this.notesKeys.delete(key);
        },
    },
});
