<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  userInfo: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['close', 'save'])

const form = ref({ nickname: '', avatar: '' })

watch(
  () => [props.show, props.userInfo],
  () => {
    if (props.show) {
      form.value = {
        nickname: props.userInfo.nickname || '',
        avatar: props.userInfo.avatar || '',
      }
    }
  },
)

function onClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="overlay" @click.self="onClose">
      <div class="modal" role="dialog" aria-modal="true" aria-label="个人中心">
        <div class="modal-head">
          <div>
            <div class="mono-label">profile</div>
            <h3>个人资料</h3>
          </div>
          <button class="modal-close" type="button" aria-label="关闭" @click="onClose">×</button>
        </div>

        <div class="modal-body">
          <p class="mono" style="font-size: 0.8rem; color: var(--ink-3); margin: 0 0 1rem">
            @{{ userInfo.username }}
            <span v-if="userInfo.username === 'admin'" class="admin-tag">admin</span>
          </p>
          <form @submit.prevent="emit('save', { nickname: form.nickname, avatar: form.avatar })">
            <div class="field">
              <label for="pf-nick">nickname</label>
              <input id="pf-nick" v-model="form.nickname" type="text" placeholder="昵称" />
            </div>
            <div class="field">
              <label for="pf-avatar">avatar url</label>
              <input id="pf-avatar" v-model="form.avatar" type="url" placeholder="头像图片地址（可留空）" />
            </div>
            <button class="btn btn--primary" style="width: 100%; justify-content: center" type="submit">保存修改</button>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>