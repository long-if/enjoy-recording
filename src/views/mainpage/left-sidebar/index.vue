<template>
    <div class="left-sidebar">
        <img src="@/assets/logo.png" alt="logo" />
        <div class="icon-box" @click="emit('toggle')">
            <svg class="icon" aria-hidden="true">
                <use
                    :xlink:href="
                        leftBarVisibility
                            ? '#icon-shouqicaidan'
                            : '#icon-zhankaicaidan'
                    "></use>
            </svg>
        </div>
        <el-divider />
        <!-- TODO 搜索功能实现 -->
        <div class="icon-box">
            <notebook-one theme="outline" size="18" fill="#333" />
        </div>
        <el-divider />
        <div class="icon-box">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-sousuo"></use>
            </svg>
        </div>
        <div class="icon-box">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-lishi"></use>
            </svg>
        </div>
        <div class="icon-box">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xing"></use>
            </svg>
        </div>
        <div class="icon-box">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tishi"></use>
            </svg>
        </div>

        <div class="icon-box">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tongji1"></use>
            </svg>
        </div>

        <div class="icon-box avatar">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-lujing"></use>
            </svg>
        </div>

        <div class="icon-box">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shezhi"></use>
            </svg>
        </div>

        <div class="icon-box">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-gengduo1"></use>
            </svg>
        </div>
    </div>
</template>

<script setup>
import { NotebookOne } from "@icon-park/vue-next";
const emit = defineEmits(["toggle"]);
const { leftBarVisibility } = defineProps(["leftBarVisibility"]);
</script>

<style scoped lang="scss">
.left-sidebar {
    --box-size: 32px;
    --size: 20px;
    width: var(--leftbar-width);
    height: 100vh;
    background-color: white;
    display: flex;
    padding-top: 0.5rem;
    padding-bottom: 1rem;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    row-gap: 8px;
    flex: 0 0 auto;
    border-right: 1px solid var(--gray-3);
    user-select: none;
    position: relative;
    top: -8px;
    z-index: 10;

    img {
        width: 45px;
        app-region: drag;
    }

    .icon-box {
        width: var(--box-size);
        height: var(--box-size);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;

        &:hover {
            cursor: pointer;
            background-color: #eff0f0;
        }

        .icon {
            width: var(--size);
            height: var(--size);
            transition: all 0.2s ease;
            position: relative;
            z-index: 2;
        }
    }

    .avatar {
        margin-top: auto;
        --box-size: 22px;

        &:hover {
            cursor: pointer;
            background-color: unset;
        }
    }
}
</style>

<style lang="scss">
.left-sidebar .el-divider--horizontal {
    width: 60% !important;
    margin: 0 !important;
}
</style>
