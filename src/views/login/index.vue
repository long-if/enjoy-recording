<template>
    <div class="container">
        <div class="card">
            <div class="header">
                <div class="title">
                    <img class="logo" src="@/assets/logo.png" alt="">
                    <span>享记</span>
                </div>
                <div class="label">—— Enjoying Recording ——</div>
            </div>
            <form class="form">
                <label for="username" class="username-icon">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zhanghao"></use>
                    </svg>
                    <input type="text" id="username" name="username" placeholder="账号" required />
                </label>
                <label for="password" class="password-icon">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-mima"></use>
                    </svg>
                    <input type="password" id="password" name="password" placeholder="密码" ref="password" required />
                    <svg class="icon eye" aria-hidden="true" @click="showHide" ref="toggle">
                        <use :xlink:href="code"></use>
                    </svg>
                </label>
                <input type="button" class="login-button" value="登录" @click="router.push('/mainpage')" />
                <el-divider class="forgot" content-position="center">忘记密码？</el-divider>
            </form>
        </div>
    </div>
</template>

<script setup>
const router = useRouter();

// 密码显隐
const input = useTemplateRef('password');
const code = ref('#icon-a-Property1xianshi');
const showHide = () => {
    if (input.value.type == "password") {
        input.value.setAttribute('type', 'text')
        code.value = "#icon-a-Property1yincang"
    }
    else {
        input.value.setAttribute('type', 'password')
        code.value = "#icon-a-Property1xianshi"
    }
}
</script>

<style scoped lang="scss">

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: linear-gradient(to bottom, #FE5723, #F9FAFB);

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
                    margin-right: .5rem;
                    float: left;
                }

                span {
                    line-height: 64px;
                    vertical-align: middle;
                }
            }

            .label {
                margin-top: .5rem;
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
            justify-content: space-between;

            @media screen and (max-width: 768px) {
                height: 300px;
                padding: 1.5rem;
            }

            label {
                height: auto;
                position: relative;

                input {
                    width: 100%;
                    border: none;
                    outline: none;
                    border-bottom: 1.8px solid #FE5723;
                    height: 3rem;
                    line-height: 2em;
                    padding-left: 2em;

                }

                #password {
                    padding-right: 2em;
                }

                .icon {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 0.5em;
                }

                .icon.eye {
                    left: unset;
                    right: 0.5em;
                    cursor: pointer;
                }
            }


            .login-button {
                appearance: none;
                height: 3rem;
                border-radius: 1.5rem;
                border: none;
                outline: none;
                color: white;
                cursor: pointer;
                background-color: var(--theme-color);
                margin-top: 1.5rem;
                box-shadow: 0 3px 10px #fe5623ad;
                transition: all 0.3s ease-in-out;

                &:hover {
                    outline: 1px solid var(--theme-color);
                }
            }

            .forgot {
                cursor: pointer;
            }
        }
    }
}
</style>