<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
</script>

<template>
  <section
    class="flex h-[276px] w-full flex-col items-center justify-center gap-6 rounded border border-[var(--border-default)] bg-[var(--color-info-100)] px-6 text-center"
    aria-labelledby="empty-group-title"
  >
    <div class="flex w-[504px] flex-col items-center gap-2">
      <h2 id="empty-group-title" class="text-xl font-medium leading-7">
        Todavía no hay nadie en tu grupo
      </h2>
      <p class="text-sm leading-5 text-[var(--text-secondary)]">
        Agrega a las personas con las que compartes las cuentas del hogar. Podrás asignarles
        facturas y saber quién responde por cada una.
      </p>
    </div>
    <AppButton class="w-[200px]">Agregar miembro</AppButton>
  </section>
</template>
