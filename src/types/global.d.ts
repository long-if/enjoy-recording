import { JSONContent } from "@tiptap/core";
import type { TreeDropInfo, TreeOption } from "naive-ui";

declare global {
    interface NotesTreeNode extends TreeOption {
        title?: string;
        content?: JSONContent;
        parentKeys?: string[];
        version?: string;
        lastModified?: string;
    }

}