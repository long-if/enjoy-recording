<template>
    <div class="empty-state">
        <div class="title">未打开文档</div>
        <n-button
            text
            color="#FF6600"
            class="button add-notes"
            @click="emit('addNotes')">
            新建文档
        </n-button>
        <n-button text color="#FF6600" class="button open-notes">
            打开文档
        </n-button>
        <n-button text color="#FF6600" class="button recent-notes">
            近期文档
        </n-button>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: "addNotes"): void;
}>();
</script>

<style scoped lang="scss">
.empty-state {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: calc(var(--top-height) - 1px);
    padding-bottom: 2rem;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
    text-align: center;
    --gap: 1.2rem;

    .title {
        color: #999999;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
        user-select: none;
    }

    .button {
        font-size: 1.2rem;
        margin-bottom: var(--gap);
        cursor: pointer;
    }
}
</style>
