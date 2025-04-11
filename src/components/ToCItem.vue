<template>
    <div :class="{
        'is-active': item.isActive && !item.isScrolledOver,
        'is-scrolled-over': item.isScrolledOver,
    }" :style="{ '--level': item.level }">
        <a :href="'#' + item.id" @click.prevent="onItemClick" :data-item-index="item.itemIndex">
            {{ item.textContent }}
        </a>
    </div>
</template>

<script setup lang="ts">
const { item, index } = defineProps<{
    item: any,
    index: number,
}>();

const emit = defineEmits<{
    itemclick: [event: Event, id: number]
}>();

function onItemClick(event: Event) {
    emit('itemclick', event, item.id)
}
</script>