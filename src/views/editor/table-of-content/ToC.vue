<template>
    <template v-if="items.length === 0">
        <ToCEmptyState />
    </template>
    <template v-else>
        <ToCItem v-for="(item, i) in items" :key="item.id" :item="item" :index="i + 1" @item-click="onItemClick" />
    </template>
</template>

<script setup lang="ts">
import { TextSelection } from '@tiptap/pm/state'
import { Editor } from '@tiptap/core'
import ToCEmptyState from './ToCEmptyState.vue'
import ToCItem from './ToCItem.vue'

const { items = [], editor } = defineProps<{
    items: Array<any>
    editor: Editor,
}>();

function onItemClick(e: Event, id: number) {
    if (editor) {
        const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`) as HTMLElement
        const pos = editor.view.posAtDOM(element, 0)

        // set focus
        const tr = editor.view.state.tr

        tr.setSelection(new TextSelection(tr.doc.resolve(pos)))

        editor.view.dispatch(tr)

        editor.view.focus()

        if (history.pushState) { // eslint-disable-line
            history.pushState(null, '', `#${id}`) // eslint-disable-line
        }

        const scrollElement = document.querySelector('.el-scrollbar__wrap') as HTMLElement;
        scrollElement.scrollTo({
            top: element.getBoundingClientRect().top - 40,
            behavior: 'smooth',
        })
    }
}
</script>