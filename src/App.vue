<script setup lang="ts"></script>

<template>
    <router-view v-slot="{ Component }">
        <n-modal-provider>
            <n-dialog-provider>
                <component :is="Component" />
            </n-dialog-provider>
        </n-modal-provider>
    </router-view>
</template>

<style lang="scss"></style>
