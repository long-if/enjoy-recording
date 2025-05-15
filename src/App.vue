<template>
    <router-view v-slot="{ Component }">
        <n-config-provider :theme-overrides="themeOverrides" abstract>
            <n-message-provider>
                <n-modal-provider>
                    <n-dialog-provider>
                        <component :is="Component" />
                    </n-dialog-provider>
                </n-modal-provider>
            </n-message-provider>
        </n-config-provider>
    </router-view>
</template>

<script setup lang="ts">
import { darkTheme, useOsTheme } from "naive-ui";
import { computed } from "vue";
const osTheme = useOsTheme();
const theme = computed(() => {
    return osTheme.value === "dark" ? darkTheme : null;
});
import { NConfigProvider, GlobalThemeOverrides } from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: "#FF6600",
        infoColor: "#FF6600",
        infoColorHover: "#ffa571",
        infoColorPressed: "#a34405",
        infoColorSuppl: "#FF6600",
    },
    Input: {
        fontSizeTiny: "14px",
        border: "1px solid #ffa571",
        borderHover: "1px solid #FF6600",
        borderFocus: "1px solid #FF6600",
        boxShadowFocus: "0 0 0 2px rgba(255,102,0,0.2)",
    },
    Drawer: {
        borderRadius: "16px",
    }
};
</script>

<style lang="scss"></style>
