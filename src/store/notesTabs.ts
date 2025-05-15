import { defineStore } from "pinia";
import { useNotesTreeStore } from "@/store/notesTree";
import { add } from "lodash-es";

export const useNotesTabsStore = defineStore("notesTabs", {
    state: () => ({
        openedNotes: [] as NotesTreeNode[],
        openedNotesKeys: new Set<string>(),
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
            this.openedNotesKeys.add(node.key as string);
            this.activeNoteName = node.key as string;
            notesTreeStore.selectedKeys = [node.key as string];
        },
        deleteTab(key: string) {
            this.openedNotes = this.openedNotes.filter(
                (item) => item.key !== key
            );
            this.openedNotesKeys.delete(key);
        },
        clearTabs() {
            this.openedNotes = [];
            this.openedNotesKeys.clear();
            this.activeNoteName = "";
            const notesTreeStore = useNotesTreeStore();
            notesTreeStore.selectedKeys = [];
        }
    },
});
