import type { TreeDropInfo, TreeOption } from "naive-ui";

declare global {
    interface NotesTab {
        title: string;
        key: string;
        content: string;
    }

    interface NotesTreeNode extends TreeOption  {
        content?: string;
        parentKeys?: string[];
    }

}