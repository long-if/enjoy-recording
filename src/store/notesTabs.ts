import { defineStore } from "pinia";
import { useNotesTreeStore } from "@/store/notesTree";

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
    },
});
