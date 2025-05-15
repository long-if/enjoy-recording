<template>
    <div v-if="editor" class="container">
        <drag-handle :editor="editor">
            <div class="custom-drag-handle"></div>
        </drag-handle>
        <editor-content
            class="editor-container"
            :editor="editor"
            spellcheck="false" />
        <div class="sidebar" v-if="!Capacitor.isNativePlatform()">
            <div class="sidebar-options">
                <div class="label-large">大纲</div>
                <div class="table-of-contents">
                    <template v-if="editor">
                        <ToC :editor="editor" :items="items" />
                    </template>
                </div>
            </div>
        </div>
        <!--  BUG 字符统计失效 -->
        <div class="character-count">
            {{ editor.storage.characterCount.characters() + "字" }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { Capacitor } from "@capacitor/core";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/vue-3";
import { Editor, JSONContent, Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import ListKeymap from "@tiptap/extension-list-keymap";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import CharacterCount from "@tiptap/extension-character-count";
import { DragHandle } from "@tiptap-pro/extension-drag-handle-vue-3";
import NodeRange from "@tiptap-pro/extension-node-range";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Gapcursor from "@tiptap/extension-gapcursor";
import {
    getHierarchicalIndexes,
    TableOfContents,
} from "@tiptap-pro/extension-table-of-contents";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Import } from "@tiptap-pro/extension-import";
import ToC from "./table-of-content/ToC.vue";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from "lowlight";
import EventEmitter from "@/lib/EventEmitter";
import { useModal } from "naive-ui";
import { useNotesTreeStore } from "@/store/notesTree";
import { useNotesTabsStore } from "@/store/notesTabs";
import { useNoteApi } from "@/api/note";
import { OptionIcon } from "lucide-vue-next";
const notesTabsStore = useNotesTabsStore();
const { openedNotes, activeNoteName, openedNotesKeys } = storeToRefs(notesTabsStore);
const notesTreeStore = useNotesTreeStore();
const { selectedKeys, expandedKeys } = storeToRefs(notesTreeStore);
const { getNotes, getNoteByKey, updateNotes } = useNoteApi();

const content = defineModel<JSONContent>("content", { required: true });
const title = defineModel<string>("title", { required: true });
const emit = defineEmits<{
    (e: "update:content", value: string): void;
    (e: "update:title", value: string): void;
}>();
const { noteKey, version } = defineProps<{
    noteKey: string | number;
    version: string;
}>();

// create a lowlight instance
const lowlight = createLowlight(all);

const CustomDocument = Document.extend({
    content: "heading block*",
});

const items = ref<any>([]);
// TODO 编辑器功能完善，气泡菜单、固定菜单
const editor = useEditor({
    content: ``,
    extensions: [
        CustomDocument,
        StarterKit.configure({
            document: false,
        }),
        Placeholder.configure({
            placeholder: ({ node }) => {
                if (node.type.name === "heading") {
                    return "What's the title?";
                }

                return "Write something...";
            },
        }),
        // Placeholder.configure({
        //     placeholder: "Write something...",
        // }),
        Highlight.configure({ multicolor: true }),
        Typography,
        // Currently the import extension requires Images to be inline
        Image.configure({
            inline: true,
        }),
        Dropcursor,
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] } as any),
        FontFamily,
        TextAlign.configure({
            types: ["heading", "paragraph"],
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        // Default TableCell
        // TableCell,
        // Custom TableCell with backgroundColor attribute
        TableCell,
        TaskList,
        TaskItem,
        CodeBlockLowlight.configure({
            lowlight,
        }),
        CharacterCount,
        NodeRange.configure({
            // allow to select only on depth 0
            depth: 0,
            key: null,
        }),
        FileHandler.configure({
            allowedMimeTypes: [
                "image/png",
                "image/jpeg",
                "image/gif",
                "image/webp",
            ],
            onDrop: (currentEditor, files) => {
                insertImage(currentEditor, files);
            },
            onPaste: (currentEditor, files) => {
                insertImage(currentEditor, files);
            },
        }),
        Gapcursor,
        TableOfContents.configure({
            getIndex: getHierarchicalIndexes,
            onUpdate: (content) => {
                items.value = content;
            },
        }),
        ListKeymap,
        Link,
        Underline,
        Subscript,
        Superscript,
        Import.configure({
            appId: "your-app-id",
            token: "your-jwt",
            // ATTENTION: This is for demo purposes only
            // endpoint: variables.tiptapConvertBaseUrl,
            // This is just for the demo, you need to implement your own image upload endpoint
            imageUploadCallbackUrl: "http://long-if.top/api/upload",
            experimentalDocxImport: true,
        }),
    ],
    onCreate({ editor }) {
        // The editor is ready.
        // console.log("editor is ready, content:", content.value);
        editor.commands.setContent(content.value);
        editor.commands.focus();
    },
    onUpdate({ editor }) {
        const newContent = editor.getJSON();
        let titleValue = "未命名";
        // 找到第一个一级标题进行相关判断处理
        const $heading = editor.$node("heading");
        if ($heading && $heading.textContent) titleValue = $heading.textContent;
        // const titleNode = newContent?.content?.find(
        //     (node) => node?.type === "heading"
        // ) as JSONContent;
        // const titleContent = titleNode?.content;
        // if (titleContent && titleContent[0].text) {
        //     titleValue = titleContent[0].text;
        // }
        title.value = titleValue;
        content.value = newContent;
        EventEmitter.emit("updateNote", {
            key: activeNoteName.value,
            nodeData: {
                title: titleValue,
                content: newContent,
                version: version,
            },
        });
    },
});

EventEmitter.on("updateNoteByFetch", (option: NotesTreeNode) => {
    // console.log("option.key", option.key);
    // console.log("key", noteKey);
    if (option.key === noteKey) {
        console.log("updateNoteByFetch事件的处理函数被调用");
        editor.value?.commands.setContent(option.content!);
    }
});

EventEmitter.on("updateNoteTitle", (keyToUpdate: string, newTitle: string) => {
    // console.log("keyToUpdate", keyToUpdate);
    // console.log("key", noteKey);
    if (keyToUpdate === noteKey) {
        console.log("updateNoteTitle事件的处理函数被调用");
        const newContent = editor.value!.getJSON();
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
        editor.value?.commands.setContent(newContent);
        content.value = newContent;
        EventEmitter.emit("updateNotesTree");
    }
});

EventEmitter.on("setEditable", (editable: boolean) => {
    if (activeNoteName.value === noteKey) {
        editor.value?.setEditable(editable, false);
    }
}); 

function insertImage(currentEditor: Editor, files: File[]) {
    files.forEach((file) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                    type: "image",
                    attrs: {
                        src: fileReader.result,
                    },
                })
                .focus()
                .run();
        };
    });
}

onBeforeUnmount(() => {
    editor.value?.destroy();
});

onMounted(() => {
    // if (editor.value) {
    //     console.log("Editor initialized:", editor.value.storage.characterCount);
    // }
});
</script>

<style scoped lang="scss">
.container {
    --margin: 1rem;
    height: auto;
    display: flex;
    margin: var(--margin);
    margin-left: 2rem;
    margin-bottom: 0;
    // margin-right: 0;
    justify-content: space-between;
    flex-direction: row;

    @media (max-width: 550px) {
        flex-direction: column-reverse;
    }

    .editor-container {
        // margin-left: 2rem;
        width: 100%;
    }

    .sidebar {
        border-left: 1px solid var(--gray-3);
        flex-grow: 0;
        flex-shrink: 0;
        padding: 1rem;
        width: 12rem;
        position: sticky;
        height: calc(100vh - 40px - var(--margin));
        top: var(--margin);

        @media (min-width: 800px) {
            width: 15rem;
        }

        @media (max-width: 540px) {
            border-bottom: 1px solid var(--gray-3);
            border-left: unset;
            width: 100%;
            height: auto;
            position: unset;
            padding: 1.5rem;
        }
    }
}

.sidebar-options {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
    position: sticky;
    top: 1rem;
    transition: all 0.5s cubic-bezier(0.65, 0.05, 0.36, 1);
}

/* Character count */
.character-count {
    display: flex;
    align-items: center;
    justify-content: end;
    color: var(--gray-5);
    font-size: 0.75rem;
    gap: 0.5rem;
    margin: 2rem;
    position: fixed;
    right: 0;
    bottom: 0;

    @media screen and (max-width: 540px) {
        transform: scale(0);
    }
}
</style>

<style lang="scss">
.table-of-contents {
    display: flex;
    flex-direction: column;
    font-size: 0.875rem;
    gap: 0.25rem;
    overflow: auto;
    text-decoration: none;

    > div {
        border-radius: 0.25rem;
        padding-left: calc(0.875rem * (var(--level) - 1));
        transition: all 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);

        &:hover {
            background-color: var(--gray-2);
        }
    }

    .empty-state {
        color: var(--gray-5);
        user-select: none;
    }

    .is-active a {
        color: var(--orange);
    }

    .is-scrolled-over a {
        color: var(--gray-5);
    }

    a {
        color: var(--black);
        display: flex;
        gap: 0.25rem;
        text-decoration: none;

        &::before {
            content: attr(data-item-index) ".";
        }
    }
}
</style>
