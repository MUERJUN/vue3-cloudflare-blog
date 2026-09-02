<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  mode: { type: String, default: 'login' }, // 'login' | 'register'
})
const emit = defineEmits(['close', 'switch-mode', 'submit-login', 'submit-register', 'send-code'])

const form = ref({ username: '', password: '', email: '', code: '' })
const countdown = ref(0)
let timer = null

watch(
  () => [props.show, props.mode],
  () => {
    if (props.show) form.value = { username: '', password: '', email: '', code: '' }
  },
)

function onClose() {
  emit('close')
}

function onSwitch(m) {
  emit('switch-mode', m)
}

function sendCode() {
  if (countdown.value > 0) return
  emit('send-code', form.value.email)
}

function onKeydown(e) {
  if (e.key === 'Escape') onClose()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="overlay" @click.self="onClose" @keydown.esc="onKeydown">
      <div class="modal" role="dialog" aria-modal="true" aria-label="账号弹窗">
        <div class="modal-head">
          <div>
            <div class="mono-label">{{ mode === 'login' ? 'sign in' : 'sign up' }}</div>
            <h3>{{ mode === 'login' ? '登录' : '注册新账号' }}</h3>
          </div>
          <button class="modal-close" type="button" aria-label="关闭" @click="onClose">×</button>
        </div>

        <div class="modal-body">
          <div class="modal-tabs">
            <button type="button" :class="{ 'is-on': mode === 'login' }" @click="onSwitch('login')">登录</button>
            <button type="button" :class="{ 'is-on': mode === 'register' }" @click="onSwitch('register')">注册</button>
          </div>

          <!-- 登录 -->
          <form v-if="mode === 'login'" @submit.prevent="emit('submit-login', { username: form.username, password: form.password })">
            <div class="field">
              <label for="lg-user">username</label>
              <input id="lg-user" v-model="form.username" type="text" autocomplete="username" placeholder="用户名" required />
            </div>
            <div class="field">
              <label for="lg-pass">password</label>
              <input id="lg-pass" v-model="form.password" type="password" autocomplete="current-password" placeholder="密码" required />
            </div>
            <button class="btn btn--primary" style="width: 100%; justify-content: center; margin-top: 0.4rem" type="submit">登录</button>
          </form>

          <!-- 注册 -->
          <form v-else @submit.prevent="emit('submit-register', form)">
            <div class="field">
              <label for="rg-user">username</label>
              <input id="rg-user" v-model="form.username" type="text" autocomplete="username" placeholder="用户名" required />
            </div>
            <div class="field">
              <label for="rg-mail">email</label>
              <input id="rg-mail" v-model="form.email" type="email" autocomplete="email" placeholder="邮箱，用于接收验证码" required />
            </div>
            <div class="field">
              <label for="rg-code">verify code</label>
              <div style="display: flex; gap: 0.5rem">
                <input id="rg-code" v-model="form.code" type="text" inputmode="numeric" placeholder="6 位验证码" style="flex: 1" />
                <button class="btn" type="button" :disabled="countdown > 0" @click="sendCode">
                  {{ countdown > 0 ? `${countdown}s` : '发验证码' }}
                </button>
              </div>
            </div>
            <div class="field">
              <label for="rg-pass">password</label>
              <input id="rg-pass" v-model="form.password" type="password" autocomplete="new-password" placeholder="设置密码" required />
            </div>
            <button class="btn btn--primary" style="width: 100%; justify-content: center; margin-top: 0.4rem" type="submit">注册</button>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>