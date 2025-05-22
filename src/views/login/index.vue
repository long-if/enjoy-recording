<template>
    <!-- TODO 登录状态保存 -->
    <div class="container">
        <div class="card">
            <div class="header">
                <div class="title">
                    <img class="logo" src="@/assets/logo.png" alt="" />
                    <span>享记</span>
                </div>
                <div class="label">—— Enjoying Recording ——</div>
            </div>
            <form class="form">
                <label for="username" class="username">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zhanghao"></use>
                    </svg>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="账号"
                        v-model="username"
                        required />
                </label>
                <label for="password" class="password">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-mima"></use>
                    </svg>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="密码"
                        ref="passwordRef"
                        v-model="password"
                        required />
                    <svg
                        v-if="password"
                        class="icon eye"
                        aria-hidden="true"
                        @click="showHide"
                        ref="toggle">
                        <use :xlink:href="code"></use>
                    </svg>
                </label>
                <div class="forgot">忘记密码？</div>
                <input
                    type="button"
                    class="login-button"
                    value="登录"
                    @click="handleLogin" />
                <n-divider class="register" title-placement="center">
                    <span>还没有账号？</span>
                    <span class="colored">现在注册!</span>
                </n-divider>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useMessage } from "naive-ui";
import { useStorage } from "@vueuse/core";
import { useLoginApi } from "@/api/login";
const router = useRouter();
const { login } = useLoginApi();
const message = useMessage();
const username = ref("");
const password = ref("");

onMounted(() => {
    try {
        window.ipcRenderer.send("setTitleBarOverlay", {
            color: "#fe5723",
            symbolColor: "#ffffff",
            height: 48,
        });
    }
    catch {
        console.log('当前为非Electron环境')
    }
})
// 密码显隐
const input = useTemplateRef("passwordRef");
const code = ref("#icon-a-Property1xianshi");
const showHide = () => {
    if (input.value.type == "password") {
        input.value.setAttribute("type", "text");
        code.value = "#icon-a-Property1yincang";
    } else {
        input.value.setAttribute("type", "password");
        code.value = "#icon-a-Property1xianshi";
    }
};

async function handleLogin() {
    if (username.value === "" || password.value === "") {
        message.error("请输入账号和密码！");
        return;
    }
    // 这里可以添加登录逻辑，比如调用API等
    // 登录成功后跳转到首页
    try {
        const response = await login({
            username: username.value,
            password: password.value,
        });
        message.success("登录成功！");
        // 登录成功后可以存储token等信息
        console.log(response.data.token);
        const token = useStorage("token");
        token.value = response.data.token;
        router.push("/mainpage");
    } catch (error) {
        message.error("登录失败，请检查账号和密码！");
        return;
    }
}
</script>

<style scoped lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: linear-gradient(to bottom, #fe5723 48px, #f9fafb);

    .card {
        width: 450px;
        border-radius: 2rem;
        border: 2px solid rgba(228, 228, 228, 0.1);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;

        @media screen and (max-width: 768px) {
            width: 60%;
            min-width: 350px;
            padding: 1rem;
        }

        .header {
            height: 120px;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            color: #fff;
            margin-bottom: 1.5rem;

            @media screen and (max-width: 768px) {
                height: 100px;
            }

            .title {
                font-size: 40px;
                font-weight: 500;

                .logo {
                    height: 64px;
                    margin-right: 0.5rem;
                    float: left;
                }

                span {
                    line-height: 64px;
                    vertical-align: middle;
                }
            }

            .label {
                margin-top: 0.5rem;
                font-size: 12px;
                color: #fff;
            }
        }

        .form {
            height: 350px;
            padding: 2rem;
            background-color: white;
            border-radius: 1.5rem;
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;

            @media screen and (max-width: 768px) {
                height: 300px;
                padding: 1.5rem;
            }

            label {
                width: 100%;
                height: auto;
                position: relative;

                &.username {
                    margin-top: 0;
                }

                &.password {
                    margin-top: 16px;
                }

                input {
                    width: 100%;
                    border: none;
                    outline: none;
                    border-bottom: 1.8px solid var(--theme-color);
                    height: 3rem;
                    line-height: 2em;
                    padding-left: 2em;
                    font-size: 1rem;
                    transition: all 400ms;

                    // &:focus {
                    //     border-radius: 8px;
                    //     border: none;
                    //     box-shadow: 0 0 10px var(--theme-color);
                    // }
                }

                #password {
                    padding-right: 2em;
                }

                .icon {
                    font-size: 1rem;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-55%);
                    left: 0.5em;
                }

                .icon.eye {
                    left: unset;
                    right: 0.5em;
                    cursor: pointer;
                }
            }

            .forgot {
                width: 100%;
                text-align: right;
                margin-top: 1rem;
                color: gray;
                cursor: pointer;
                text-decoration: underline;

                @media screen and (max-width: 768px) {
                    margin-top: 12px;
                }
            }

            .login-button {
                appearance: none;
                width: 100%;
                height: 3rem;
                border-radius: 1rem;
                border: none;
                outline: none;
                color: white;
                cursor: pointer;
                background-color: var(--theme-color);
                font-size: 1.2rem;
                font-weight: 500;
                margin-top: 1.5rem;
                box-shadow: 0 3px 10px #fe5623ad;
                outline: 1px solid transparent;
                transition: all 0.4s;

                // &:hover {
                //     outline: 1px solid var(--theme-color);
                // }

                &:active {
                    background-color: #fe5723;
                    box-shadow: 0 2px 5px #fe5623ad;
                }

                @media screen and (max-width: 768px) {
                    margin-top: 1rem;
                }
            }

            .register {
                width: 100%;

                .colored {
                    color: var(--theme-color);
                    font-weight: 500;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.n-divider:not(.n-divider--vertical) {
    margin-top: 2rem;
    margin-bottom: 0;

    @media screen and (max-width: 768px) {
        margin-top: 24px;
    }
}
</style>
