<template>
    <!-- BUG FeatureBar的滚动问题 -->
    <div class="feature-bar">
        <div
            class="icon-box show-drawer"
            v-if="Capacitor.isNativePlatform()"
            @click="DrawerVisibility = !DrawerVisibility">
            <svg class="icon" aria-hidden="true">
                <!-- <use
                    :xlink:href="
                        DrawerVisibility
                            ? '#icon-shouqicaidan'
                            : '#icon-zhankaicaidan'
                    "></use> -->
                <use xlink:href="#icon-cebianlan"></use>
            </svg>
        </div>
        <div class="title">{{ currentTitle }}</div>
        <div
            class="icon-box"
            v-if="!Capacitor.isNativePlatform() && openedNotes.length > 0">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-chehui"></use>
            </svg>
        </div>
        <div
            class="icon-box left"
            v-if="!Capacitor.isNativePlatform() && openedNotes.length > 0">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-qianjin"></use>
            </svg>
        </div>
        <div class="icon-box star" v-show="openedNotes.length > 0">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xing"></use>
            </svg>
        </div>
        <div
            class="icon-box"
            v-show="openedNotes.length > 0"
            @click="
                editable = !editable;
                EventEmitter.emit('setEditable', editable);
            ">
            <svg class="icon" aria-hidden="true">
                <use
                    :xlink:href="
                        !editable ? '#icon-bianji1' : '#icon-yuedu'
                    "></use>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Capacitor } from "@capacitor/core";
import { WritingFluently, Edit } from "@icon-park/vue-next";
import EventEmitter from "@/lib/EventEmitter";
import { useNotesTabsStore } from "@/store/notesTabs";
const notesTabsStore = useNotesTabsStore();
const { openedNotes, activeNoteName, openedNotesKeys } =
    storeToRefs(notesTabsStore);
const DrawerVisibility = defineModel();
const editable = ref(true);

const currentTitle = computed(() => {
    const currentNote = openedNotes.value.find(
        (note) => note.key === activeNoteName.value
    );
    return currentNote ? currentNote.title : "";
});
</script>

<style scoped lang="scss">
.feature-bar {
    --box-size: 32px;
    --size: 20px;
    width: 100%;
    height: 40px;
    background-color: white;
    // border-bottom: 1px solid var(--gray-3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
    column-gap: 0.5rem;
    position: sticky;
    top: 0;
    z-index: 90;

    .title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
    }

    .icon-box {
        width: var(--box-size);
        height: var(--box-size);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;

        .icon {
            width: var(--size);
            height: var(--size);
            transition: all 0.2s ease;
            position: relative;
            z-index: 2;
        }
    }

    .show-drawer {
        margin-right: auto;
        --box-size: 32px;
        --size: 22px;
    }

    .star {
        --box-size: 32px;
        --size: 22px;
    }

    .left {
        margin-right: auto;
    }
}
</style>
