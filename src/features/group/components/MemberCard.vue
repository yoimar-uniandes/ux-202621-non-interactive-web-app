<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'

defineProps<{ id: string; name: string; summary: string }>()
const emit = defineEmits<{ delete: [id: string] }>()
</script>

<template>
  <article
    class="flex h-[172px] flex-col rounded-xl border border-[var(--border-default)] bg-white p-6"
  >
    <h2 class="text-base font-medium leading-6">{{ name }}</h2>
    <p class="mt-2 text-sm leading-5 text-[var(--text-secondary)]">{{ summary }}</p>
    <div class="mt-auto flex items-center gap-6 pt-6">
      <AppButton variant="secondary" class="min-w-40"> Asignar facturas </AppButton
      ><button
        type="button"
        class="h-12 text-sm font-normal leading-5 text-[var(--text-destructive)] underline underline-offset-2"
        @click="emit('delete', id)"
      >
        Eliminar
      </button>
    </div>
  </article>
</template>
