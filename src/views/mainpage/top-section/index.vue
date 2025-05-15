<template>
    <div class="top-section">
        <div class="up">
            <img src="@/assets/logo.png" alt="logo" />
            <div class="icon-box avatar">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-lujing"></use>
                </svg>
            </div>
            <div class="username">{{ `用户名123` }}</div>
            <div class="icon-box setting">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-shezhi1"></use>
                </svg>
            </div>
        </div>
        <div class="down">
            <n-select v-model:value="value" :options="options">
                <template #arrow>
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-shuangxiangjiantou"></use>
                    </svg>
                </template>
            </n-select>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    NotebookOne,
    Search,
    History,
    Star,
    Tips,
    Analysis,
} from "@icon-park/vue-next";
import type { VNodeChild } from "vue";
import type { SelectGroupOption, SelectOption } from "naive-ui";
const value = ref("notes");
const options = [
    {
        label: renderLabel("笔记", NotebookOne),
        value: "notes",
    },
    {
        label: renderLabel("搜索", Search),
        value: "search",
    },
    {
        label: renderLabel("历史", History),
        value: "history",
    },
    {
        label: renderLabel("收藏", Star),
        value: "stars",
    },
    {
        label: renderLabel("提示", Tips),
        value: "tips",
    },
    {
        label: renderLabel("统计", Analysis),
        value: "statistics",
    },
];

function renderLabel(label: string, icon: Component) {
    return (option: SelectOption): VNodeChild => {
        return [
            h(
                NIcon,
                {
                    style: {
                        verticalAlign: "-.5px",
                        marginRight: "8px",
                    },
                },
                {
                    default: () => h(icon),
                }
            ),
            label,
        ];
    };
}
</script>

<style scoped lang="scss">
.top-section {
    --box-size: 32px;
    --size: 20px;
    width: 100%;
    height: 98px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 10px;

    .up {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
            width: 50px;
        }

        .avatar {
            margin-left: 0.5rem;
            margin-right: 0.5rem;
            --box-size: 50px;
            --size: 30px;
        }

        .username {
            width: 100%;
            padding-right: 0.5rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .setting {
            margin-left: auto;
            margin-right: 1rem;
            color: var(--theme-color);
            --box-size: 50px;
            --size: 30px;
        }
    }

    .down {
        width: 100%;
        height: 40px;
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
}
</style>

<style lang="scss">
.n-base-selection {
    --n-border-focus: 1px solid #ff6600 !important;
    --n-border-hover: 1px solid #ff6600 !important;
    --n-border-radius: 8px !important;
    --n-font-size: 16px !important;
    --n-height: 40px !important;
}

.n-base-select-menu.n-select-menu {
    --n-option-height: 40px !important;
    --n-option-font-size: 16px !important;
    --n-option-text-color-pressed: #fb6b3f !important;
}
</style>
