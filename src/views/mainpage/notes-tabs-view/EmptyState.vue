<template>
    <div class="note-view-empty-state">
        <div class="tip" v-if="Capacitor.isNativePlatform()">打开管理面板查看你的笔记</div>
        <slot></slot>
        <div class="title">未打开文档</div>
        <n-button
            text
            color="#FF6600"
            class="button add-notes"
            @click="EventEmitter.emit('addNote', null)">
            新建文档
        </n-button>
        <n-button text color="#FF6600" class="button open-notes" @click="emit('openNotesManager')">
            打开文档
        </n-button>
        <n-button text color="#FF6600" class="button recent-notes">
            近期文档
        </n-button>
    </div>
</template>

<script setup lang="ts">
import { Capacitor } from "@capacitor/core";
import EventEmitter from "@/lib/EventEmitter";
const emit = defineEmits<{
    (e: "openNotesManager"): void;
}>();
</script>

<style lang="scss">
.note-view-empty-state {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: var(--top-height);
    padding-bottom: 2rem;
    height: 100%;
    width: 100%;
    border-top: 1px solid var(--gray-3);
    background-color: #f5f5f5;
    background-color: #ffffff;
    text-align: center;
    --gap: 1.2rem;

    .feature-bar {
        margin-bottom: auto;
    }

    .title {
        color: #999999;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
        margin-top: -6rem;
        user-select: none;
    }
    .tip {
        position: absolute;
        width: 100%;
        height: var(--top-height);
        align-content: center;
        top: 0;
    }

    .button {
        font-size: 1.2rem;
        margin-bottom: var(--gap);
        cursor: pointer;

        &.recent-notes {
            margin-bottom: auto;
        }
    }
}
</style>
