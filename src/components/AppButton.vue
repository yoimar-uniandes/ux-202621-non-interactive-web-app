<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'destructive'
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    class="inline-flex h-12 items-center justify-center px-6 text-sm font-medium leading-5 transition-colors"
    :class="{
      'rounded bg-[var(--action-primary)] text-[var(--text-on-primary)] hover:bg-[var(--action-primary-hover)]':
        variant === 'primary',
      'rounded-full border border-[var(--text-primary)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]':
        variant === 'secondary',
      'rounded-full bg-[var(--action-destructive)] text-white hover:bg-[var(--color-error-900)]':
        variant === 'destructive',
    }"
  >
    <slot />
  </button>
</template>
