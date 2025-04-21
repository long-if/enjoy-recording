import { defineStore } from 'pinia';

export const useNotesTabsStore = defineStore('notesTabs', {
    state: () => ({
        openedNotes: [] as NotesTab[],
        notesKeys: new Set<string>(),
        activeNoteName: '',
    })
})