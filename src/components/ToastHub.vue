<script setup>
import { toasts } from '../lib/toast.js'
</script>

<template>
  <div class="toast-hub" aria-live="polite">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast"
      :class="{ 'toast--ok': t.type === 'ok', 'toast--err': t.type === 'err', 'toast--info': t.type === 'info' }"
    >
      <span class="t-mark" aria-hidden="true">{{ t.type === 'ok' ? '✓' : t.type === 'err' ? '✕' : 'ℹ' }}</span>
      <span>{{ t.msg }}</span>
    </div>
  </div>
</template>