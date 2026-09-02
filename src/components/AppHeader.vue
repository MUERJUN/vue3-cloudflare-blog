<script setup>
defineProps({
  isLogin: { type: Boolean, default: false },
  userInfo: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['open-login', 'open-register', 'open-profile', 'logout'])

// 无头像时用用户名首字做占位
function avatarInitial(u) {
  return (u.nickname || u.username || '?').slice(0, 1).toUpperCase()
}
</script>

<template>
  <header class="site-header">
    <div class="wrap-wide">
      <a class="brand" href="/">
        <span>CyberBlog</span>
        <span class="brand-path">~/blog</span>
        <span class="brand-cursor" aria-hidden="true">▍</span>
      </a>

      <nav class="site-nav" aria-label="站点导航">
        <a href="/" aria-current="page">home</a>
        <a href="#">projects</a>
        <a href="#">about</a>
      </nav>

      <div class="auth-area">
        <template v-if="!isLogin">
          <button class="btn btn--ghost btn--sm" type="button" @click="emit('open-login')">登录</button>
          <button class="btn btn--primary btn--sm" type="button" @click="emit('open-register')">注册</button>
        </template>
        <template v-else>
          <div class="user-chip" role="button" tabindex="0" @click="emit('open-profile')" @keydown.enter="emit('open-profile')">
            <img v-if="userInfo.avatar" class="user-avatar" :src="userInfo.avatar" :alt="userInfo.nickname" />
            <span v-else class="user-avatar">{{ avatarInitial(userInfo) }}</span>
            <span class="user-name">{{ userInfo.nickname || userInfo.username }}</span>
            <span v-if="userInfo.username === 'admin'" class="admin-tag">admin</span>
          </div>
          <button class="btn btn--ghost btn--sm" type="button" @click="emit('logout')">退出</button>
        </template>
      </div>
    </div>
  </header>
</template>