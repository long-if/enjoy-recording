<template>
    <div v-if="editor" class="container">
        <div class="control-group">
            <div class="button-group">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }">
                    Bold
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }">
                    Italic
                </button>
                <button @click="editor.chain().focus().toggleStrike().run()"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor.isActive('strike') }">
                    Strike
                </button>
                <button @click="editor.chain().focus().toggleUnderline().run()"
                    :disabled="!editor.can().chain().focus().toggleUnderline().run()"
                    :class="{ 'is-active': editor.isActive('underline') }">
                    Underline
                </button>
                <button @click="editor.chain().focus().toggleCode().run()"
                    :disabled="!editor.can().chain().focus().toggleCode().run()"
                    :class="{ 'is-active': editor.isActive('code') }">
                    Code
                </button>
                <button @click="editor.chain().focus().unsetAllMarks().run()">
                    Clear marks
                </button>
                <button @click="editor.chain().focus().clearNodes().run()">
                    Clear nodes
                </button>
                <button @click="editor.chain().focus().setParagraph().run()"
                    :class="{ 'is-active': editor.isActive('paragraph') }">
                    Paragraph
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                    H1
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                    H2
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
                    H3
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
                    H4
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
                    H5
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
                    H6
                </button>
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor.isActive('bulletList') }">
                    Bullet list
                </button>
                <button @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor.isActive('orderedList') }">
                    Ordered list
                </button>
                <button @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'is-active': editor.isActive('codeBlock') }">
                    Code block
                </button>
                <button @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'is-active': editor.isActive('blockquote') }">
                    Blockquote
                </button>
                <button @click="editor.chain().focus().setHorizontalRule().run()">
                    Horizontal rule
                </button>
                <button @click="editor.chain().focus().setHardBreak().run()">
                    Hard break
                </button>
                <button @click="editor.chain().focus().undo().run()"
                    :disabled="!editor.can().chain().focus().undo().run()">
                    Undo
                </button>
                <button @click="editor.chain().focus().redo().run()"
                    :disabled="!editor.can().chain().focus().redo().run()">
                    Redo
                </button>
                <button @click="editor.chain().focus().setColor('#958DF1').run()"
                    :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }">
                    orange
                </button>
                <button @click="editor.chain().focus().toggleHighlight().run()"
                    :class="{ 'is-active': editor.isActive('highlight') }">
                    Highlight
                </button>
                <button @click="editor.chain().focus().setTextAlign('left').run()"
                    :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
                    Left
                </button>
                <button @click="editor.chain().focus().setTextAlign('center').run()"
                    :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
                    Center
                </button>
                <button @click="editor.chain().focus().setTextAlign('right').run()"
                    :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
                    Right
                </button>
                <button @click="editor.chain().focus().setTextAlign('justify').run()"
                    :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
                    Justify
                </button>
                <br>
                <button @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()">
                    Insert table
                </button>
                <button
                    @click="editor.chain().focus().insertContent(tableHTML, { parseOptions: { preserveWhitespace: false } }).run()">
                    Insert HTML table
                </button>
                <button @click="editor.chain().focus().addColumnBefore().run()"
                    :disabled="!editor.can().addColumnBefore()">
                    Add column before
                </button>
                <button @click="editor.chain().focus().addColumnAfter().run()"
                    :disabled="!editor.can().addColumnAfter()">
                    Add column after
                </button>
                <button @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()">
                    Delete column
                </button>
                <button @click="editor.chain().focus().addRowBefore().run()" :disabled="!editor.can().addRowBefore()">
                    Add row before
                </button>
                <button @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()">
                    Add row after
                </button>
                <button @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()">
                    Delete row
                </button>
                <button @click="editor.chain().focus().deleteTable().run()" :disabled="!editor.can().deleteTable()">
                    Delete table
                </button>
                <button @click="editor.chain().focus().mergeCells().run()" :disabled="!editor.can().mergeCells()">
                    Merge cells
                </button>
                <button @click="editor.chain().focus().splitCell().run()" :disabled="!editor.can().splitCell()">
                    Split cell
                </button>
                <button @click="editor.chain().focus().toggleHeaderColumn().run()"
                    :disabled="!editor.can().toggleHeaderColumn()">
                    Toggle header column
                </button>
                <button @click="editor.chain().focus().toggleHeaderRow().run()"
                    :disabled="!editor.can().toggleHeaderRow()">
                    Toggle header row
                </button>
                <button @click="editor.chain().focus().toggleHeaderCell().run()"
                    :disabled="!editor.can().toggleHeaderCell()">
                    Toggle header cell
                </button>
                <button @click="editor.chain().focus().mergeOrSplit().run()" :disabled="!editor.can().mergeOrSplit()">
                    Merge or split
                </button>
                <button @click="editor.chain().focus().setCellAttribute('backgroundColor', '#FAF594').run()"
                    :disabled="!editor.can().setCellAttribute('backgroundColor', '#FAF594')">
                    Set cell attribute
                </button>
                <button @click="editor.chain().focus().fixTables().run()" :disabled="!editor.can().fixTables()">
                    Fix tables
                </button>
                <button @click="editor.chain().focus().goToNextCell().run()" :disabled="!editor.can().goToNextCell()">
                    Go to next cell
                </button>
                <button @click="editor.chain().focus().goToPreviousCell().run()"
                    :disabled="!editor.can().goToPreviousCell()">
                    Go to previous cell
                </button>
                <button @click="addImage">Add image from URL</button>
                <button @click="editor.chain().focus().setFontFamily('Inter').run()"
                    :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'Inter' }) }">
                    Inter
                </button>
                <button @click="editor.chain().focus().setFontFamily('Comic Sans MS, Comic Sans').run()"
                    :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' }) }">
                    Comic Sans
                </button>
                <button @click="editor.chain().focus().setFontFamily('serif').run()"
                    :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'serif' }) }">
                    Serif
                </button>
                <button @click="editor.chain().focus().setFontFamily('monospace').run()"
                    :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'monospace' }) }">
                    Monospace
                </button>
                <button @click="editor.chain().focus().setFontFamily('cursive').run()"
                    :class="{ 'is-active': editor.isActive('textStyle', { fontFamily: 'cursive' }) }">
                    Cursive
                </button>
                <button @click="editor.chain().focus().unsetFontFamily().run()">
                    Unset font family
                </button>
                <button @click="handleImportClick">
                    Import document
                    <input type="file" ref="importRef" style="display: none" @change="handleImportFilePick">
                </button>
                <button @click="editor.setEditable(!editor.isEditable)">
                    Toggle editable
                </button>
            </div>
        </div>
        <div v-if="isLoading" class="hint orange-spinner">Processing...</div>
        <div v-if="error" class="hint error" v-text="error.message" />
        <drag-handle :editor="editor">
            <div class="custom-drag-handle"></div>
        </drag-handle>
        <div class="content">
            <editor-content class="editor-container" :editor="editor" spellcheck="false" />
            <div class="sidebar" v-if="!Capacitor.isNativePlatform()">
                <div class="sidebar-options">
                    <div class="label-large">Table of contents</div>
                    <div class="table-of-contents">
                        <template v-if="editor">
                            <ToC :editor="editor" :items="items" />
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="character-count">{{ editor.storage.characterCount.characters() + '字' }}</div>
        <!-- <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
            <div class="bubble-menu">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }">
                    Bold
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }">
                    Italic
                </button>
                <button @click="editor.chain().focus().toggleStrike().run()"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor.isActive('strike') }">
                    Strike
                </button>
            </div>
        </bubble-menu> -->
    </div>
</template>

<script setup lang="ts">
import { Capacitor } from '@capacitor/core';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/vue-3';
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import ListKeymap from '@tiptap/extension-list-keymap'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import CharacterCount from '@tiptap/extension-character-count'
import { DragHandle } from '@tiptap-pro/extension-drag-handle-vue-3'
import NodeRange from '@tiptap-pro/extension-node-range'
import FileHandler from '@tiptap-pro/extension-file-handler'
import Gapcursor from '@tiptap/extension-gapcursor'
import { getHierarchicalIndexes, TableOfContents } from '@tiptap-pro/extension-table-of-contents'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Import } from '@tiptap-pro/extension-import'
import { defineComponent } from 'vue'
import ToC from './ToC.vue'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register languages
// lowlight.register('html', html)
// lowlight.register('css', css)
// lowlight.register('js', js)
// lowlight.register('ts', ts)

const CustomTableCell = TableCell.extend({
    addAttributes() {
        return {
            // extend the existing attributes …
            ...this.parent?.(),

            // and add a new one …
            backgroundColor: {
                default: null,
                parseHTML: element => element.getAttribute('data-background-color'),
                renderHTML: attributes => {
                    return {
                        'data-background-color': attributes.backgroundColor,
                        style: `background-color: ${attributes.backgroundColor}`,
                    }
                },
            },
        }
    },
})

const CustomDocument = Document.extend({
    content: 'heading block*',
})

const CustomTaskItem = TaskItem.extend({
    content: 'inline*',
})

const items = ref<any>([])
const editor = useEditor({
    content: `
        <p>
            Markdown shortcuts make it easy to format the text while typing.
        </p>
        <p>
            To test that, start a new line and type <code>#</code> followed by a space to get a heading. Try <code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different levels.
        </p>
        <p>
            Those conventions are called input rules in Tiptap. Some of them are enabled by default. Try <code>></code> for blockquotes, <code>*</code>, <code>-</code> or <code>+</code> for bullet lists, or <code>\`foobar\`</code> to highlight code, <code>~~tildes~~</code> to strike text, or <code>==equal signs==</code> to highlight text.
        </p>
        <p>
            You can overwrite existing input rules or add your own to nodes, marks and extensions.
        </p>
        <p>
            For example, we added the <code>Typography</code> extension here. Try typing <code>(c)</code> to see how it’s converted to a proper © character. You can also try <code>-></code>, <code>>></code>, <code>1/2</code>, <code>!=</code>, or <code>--</code>.
        </p>
        <ul data-type="taskList">
            <li data-type="taskItem" data-checked="true">flour</li>
            <li data-type="taskItem" data-checked="true">baking powder</li>
            <li data-type="taskItem" data-checked="true">salt</li>
            <li data-type="taskItem" data-checked="false">sugar</li>
            <li data-type="taskItem" data-checked="false">milk</li>
            <li data-type="taskItem" data-checked="false">eggs</li>
            <li data-type="taskItem" data-checked="false">butter</li>
        </ul>
        <h1 id="0ce2eb59-3fa6-45ed-b8c9-96520f40a126" data-toc-id="0ce2eb59-3fa6-45ed-b8c9-96520f40a126">Text editor</h1><p>A text editor is a type of computer program that edits plain text. Such programs are sometimes known as "notepad" software (e.g. Windows Notepad). Text editors are provided with operating systems and software development packages, and can be used to change files such as configuration files, documentation files and programming language source code.</p><h2 id="cab8b6be-1a4c-445a-a04b-8c3ed117bbed" data-toc-id="cab8b6be-1a4c-445a-a04b-8c3ed117bbed">Plain text and rich text</h2><p>There are important differences between plain text (created and edited by text editors) and rich text (such as that created by word processors or desktop publishing software).</p><p>Plain text exclusively consists of character representation. Each character is represented by a fixed-length sequence of one, two, or four bytes, or as a variable-length sequence of one to four bytes, in accordance to specific character encoding conventions, such as ASCII, ISO/IEC 2022, Shift JIS, UTF-8, or UTF-16. These conventions define many printable characters, but also non-printing characters that control the flow of the text, such as space, line break, and page break. Plain text contains no other information about the text itself, not even the character encoding convention employed. Plain text is stored in text files, although text files do not exclusively store plain text. Since the early days of computers, plain text was (once by necessity and now by convention) generally displayed using a monospace font, such that horizontal alignment and columnar formatting were sometimes done using whitespace characters.</p><p>Rich text, on the other hand, may contain metadata, character formatting data (e.g. typeface, size, weight and style), paragraph formatting data (e.g. indentation, alignment, letter and word distribution, and space between lines or other paragraphs), and page specification data (e.g. size, margin and reading direction). Rich text can be very complex. Rich text can be saved in binary format (e.g. DOC), text files adhering to a markup language (e.g. RTF or HTML), or in a hybrid form of both (e.g. Office Open XML).</p><p>Text editors are intended to open and save text files containing either plain text or anything that can be interpreted as plain text, including the markup for rich text or the markup for something else (e.g. SVG).</p><h2 id="77475a1a-26c2-4aec-ad6e-a11266c1f477" data-toc-id="77475a1a-26c2-4aec-ad6e-a11266c1f477">History</h2><p>Before text editors existed, computer text was punched into cards with keypunch machines. Physical boxes of these thin cardboard cards were then inserted into a card reader. Magnetic tape, drum and disk card image files created from such card decks often had no line-separation characters at all, and assumed fixed-length 80- or 90-character records. An alternative to cards was Punched tape. It could be created by some teleprinters (such as the Teletype), which used special characters to indicate ends of records. Some early operating systems included batch text editors, either integrated with language processors or as separate utility programs; one early example was the ability to edit SQUOZE source files for SCAT in SHARE Operating System.</p><p>The first interactive text editors were "line editors" oriented to teleprinter- or typewriter-style terminals without displays. Commands (often a single keystroke) effected edits to a file at an imaginary insertion point called the "cursor". Edits were verified by typing a command to print a small section of the file, and periodically by printing the entire file. In some line editors, the cursor could be moved by commands that specified the line number in the file, text strings (context) for which to search, and eventually regular expressions. Line editors were major improvements over keypunching. Some line editors could be used by keypunch; editing commands could be taken from a deck of cards and applied to a specified file. Some common line editors supported a "verify" mode in which change commands displayed the altered lines.</p><h5 id="04d56933-658f-4733-ae33-74f6c791a07a" data-toc-id="04d56933-658f-4733-ae33-74f6c791a07a">Weird h5 headline</h5><p>When computer terminals with video screens became available, screen-based text editors (sometimes called just "screen editors") became common. One of the earliest full-screen editors was O26, which was written for the operator console of the CDC 6000 series computers in 1967. Another early full-screen editor was vi. Written in the 1970s, it is still a standard editor on Unix and Linux operating systems. Also written in the 1970s was the UCSD Pascal Screen Oriented Editor, which was optimized both for indented source code and general text. Emacs, one of the first free and open-source software projects, is another early full-screen or real-time editor, one that was ported to many systems. A full-screen editor's ease-of-use and speed (compared to the line-based editors) motivated many early purchases of video terminals.</p><h2 id="309f3c0c-2657-4971-bda0-fb9f6df224ea" data-toc-id="309f3c0c-2657-4971-bda0-fb9f6df224ea">Types of text editors</h2><h3 id="4be41550-2f33-486b-a48a-6da6675aacbb" data-toc-id="4be41550-2f33-486b-a48a-6da6675aacbb">Simple text editors</h3><p>Some text editors are small and simple, while others offer broad and complex functions. For example, Unix and Unix-like operating systems have the pico editor (or a variant), but many also include the vi and Emacs editors. Microsoft Windows systems come with the simple Notepad, though many people—especially programmers—prefer other editors with more features. Under Apple Macintosh's classic Mac OS there was the native TeachText later replaced by SimpleText in 1994, which was replaced in Mac OS X by TextEdit, which combines features of a text editor with those typical of a word processor such as rulers, margins and multiple font selection. These features are not available simultaneously, but must be switched by user command, or through the program automatically determining the file type.</p><h3 id="e995acbb-81e7-40ce-a3e0-e026b3e1c7e2" data-toc-id="e995acbb-81e7-40ce-a3e0-e026b3e1c7e2">Word editors</h3><p>Most word processors can read and write files in plain text format, allowing them to open files saved from text editors. Saving these files from a word processor, however, requires ensuring the file is written in plain text format, and that any text encoding or BOM settings won't obscure the file for its intended use. Non-WYSIWYG word processors, such as WordStar, are more easily pressed into service as text editors, and in fact were commonly used as such during the 1980s. The default file format of these word processors often resembles a markup language, with the basic format being plain text and visual formatting achieved using non-printing control characters or escape sequences. Later word processors like Microsoft Word store their files in a binary format and are almost never used to edit plain text files.</p>
        `,
    extensions: [
        Document,
        StarterKit.configure({
            document: false,
        }),
        // Placeholder.configure({
        //     placeholder: ({ node }) => {
        //         if (node.type.name === 'heading') {
        //             return 'What’s the title?'
        //         }

        //         return 'Can you add some further context?'
        //     },
        // }),
        Placeholder.configure({
            placeholder: 'Write something...',
        }),
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
            types: ['heading', 'paragraph'],
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        // Default TableCell
        // TableCell,
        // Custom TableCell with backgroundColor attribute
        CustomTableCell,
        TaskList,
        TaskItem,
        CodeBlockLowlight.configure({
            lowlight,
        }),
        CharacterCount,
        NodeRange.configure({
            // allow to select only on depth 0
            // depth: 0,
            key: null,
        }),
        FileHandler.configure({
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            onDrop: (currentEditor, files) => {
                insertImage(currentEditor, files)
            },
            onPaste: (currentEditor, files) => {
                insertImage(currentEditor, files)
            },
        }),
        Gapcursor,
        TableOfContents.configure({
            getIndex: getHierarchicalIndexes,
            onUpdate: content => {
                items.value = content
            },
        }),
        ListKeymap,
        Link,
        Underline,
        Subscript,
        Superscript,
        Import.configure({
            appId: 'your-app-id',
            token: 'your-jwt',
            // ATTENTION: This is for demo purposes only
            // endpoint: variables.tiptapConvertBaseUrl,
            // This is just for the demo, you need to implement your own image upload endpoint
            imageUploadCallbackUrl: 'http://long-if.top/api/upload',
            experimentalDocxImport: true,
        }),
    ],
})
const isLoading = ref(false);
const error = ref<any>(null)
const importRef = useTemplateRef('importRef')
function handleImportClick() {
    importRef.value?.click()
};

function handleImportFilePick(e: Event) {
    // @ts-ignore
    const file = e.target.files[0]
    // @ts-ignore
    importRef.value.value = ''

    if (!file) {
        return
    }

    isLoading.value = true
    error.value = null
    editor.value?.chain().import({
        file,
        onImport: context => {
            if (context.error) {
                error.value = context.error
                isLoading.value = false
                return
            }
            context.setEditorContent()
            isLoading.value = false
            error.value = null
        },

    }).run()
}

// @ts-ignore
window.editor = editor

function insertImage(currentEditor: Editor, files: File[]) {
    files.forEach(file => {
        const fileReader = new FileReader()

        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
            currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
                type: 'image',
                attrs: {
                    src: fileReader.result,
                },
            }).focus().run()
        }
    })
}

function addImage() {
    const url = `data:image/jpeg;base64,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`

    if (url) {
        editor.value?.chain().focus().setImage({ src: url }).run()
    }
}

const tableHTML = `
    <table style="width:100%">
    <tr>
        <th>Firstname</th>
        <th>Lastname</th>
        <th>Age</th>
    </tr>
    <tr>
        <td>Jill</td>
        <td>Smith</td>
        <td>50</td>
    </tr>
    <tr>
        <td>Eve</td>
        <td>Jackson</td>
        <td>94</td>
    </tr>
    <tr>
        <td>John</td>
        <td>Doe</td>
        <td>80</td>
    </tr>
    </table>`;

onBeforeMount(() => {
    editor.value?.destroy()
})
</script>

<style lang="scss">
.container {
    height: auto;
}

.content {
    height: auto;
    position: relative;
    overflow: visible;
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    @media (max-width: 550px) {
        flex-direction: column-reverse;
    }

    .editor-container {
        // margin-left: 1.2rem;
        width: auto;
    }
}

.control-group {

    .button-group {
        display: flex;
        padding: 0.2rem;
        column-gap: 3px;
        row-gap: 5px;
        flex-wrap: wrap;

        button {
            border: none;
            border-radius: 0.5rem;
            background-color: var(--gray-1);

            &:hover {
                background-color: var(--gray-3);
            }

            &.is-active {
                background-color: var(--orange);

                &:hover {
                    background-color: var(--orange-contrast);
                }
            }
        }
    }
}


/* Character count */
.character-count {
    display: flex;
    align-items: center;
    justify-content: end;
    color: var(--gray-5);
    font-size: 0.75rem;
    gap: .5rem;
    margin: 1rem;
    position: fixed;
    right: 0;
    bottom: 0;

    @media screen and (max-width: 540px) {
        transform: scale(0);
    }
}

.sidebar {
    margin-top: 2rem;
    border-left: 1px solid var(--gray-3);
    flex-grow: 0;
    flex-shrink: 0;
    padding: 1rem;
    width: 15rem;
    position: sticky;
    height: 100vh;
    top: 0;

    @media (min-width: 800px) {
        width: 20rem;
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

.table-of-contents {

    display: flex;
    flex-direction: column;
    font-size: 0.875rem;
    gap: 0.25rem;
    overflow: auto;
    text-decoration: none;

    >div {
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
            content: attr(data-item-index) '.';
        }
    }
}

/* Outer elements */
.main {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.controls {
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.loading {
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, .87);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 500;
}
</style>