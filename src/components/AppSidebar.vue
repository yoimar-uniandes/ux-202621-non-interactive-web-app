<script setup lang="ts">
const primaryItems = [
  { label: 'Inicio', icon: '/icons/home.svg' },
  { label: 'Pagos', icon: '/icons/payments.svg' },
  { label: 'Reportes', icon: '/icons/reports.svg' },
  { label: 'Grupo', icon: '/icons/group.svg' },
  { label: 'Perfil', icon: '/icons/profile.svg' },
] as const
</script>

<template>
  <aside class="sidebar" aria-label="Navegación principal">
    <div>
      <div class="brand">
        <span class="brand__mark" aria-hidden="true">
          <img src="/icons/fakto-logo.svg" alt="" width="24" height="24" />
        </span>
        <span class="brand__name">Fakto</span>
      </div>
      <div class="sidebar__separator sidebar__separator--brand" />

      <nav class="sidebar__navigation">
        <ul class="m-0 flex list-none flex-col gap-2 p-0">
          <li v-for="item in primaryItems" :key="item.label">
            <button
              type="button"
              class="nav-item"
              :class="item.label === 'Grupo' && 'nav-item--active'"
              :aria-current="item.label === 'Grupo' ? 'page' : undefined"
            >
              <img :src="item.icon" alt="" width="24" height="24" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <div class="mt-auto">
      <div class="sidebar__separator mb-6" />
      <button type="button" class="nav-item">
        <img src="/icons/settings.svg" alt="" width="24" height="24" aria-hidden="true" />
        <span>Ajustes</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 10;
  display: flex;
  width: var(--sidebar-width);
  min-height: 100vh;
  flex-direction: column;
  padding: 24px;
  border-right: 1px solid var(--border-default);
  background: var(--surface-default);
  color: var(--text-primary);
}
.brand {
  display: flex;
  height: 48px;
  align-items: center;
  gap: 12px;
}
.brand__mark {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border-radius: 12px;
  background: var(--action-primary);
}
.brand__name {
  font-size: 26px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -0.26px;
}
.sidebar__separator {
  height: 1px;
  background: var(--border-default);
}
.sidebar__separator--brand {
  margin-top: 8px;
}
.sidebar__navigation {
  margin-top: 24px;
}
.nav-item {
  position: relative;
  display: flex;
  width: 100%;
  height: 48px;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  padding: 12px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
}
.nav-item:hover {
  background: var(--color-neutral-50);
}
.nav-item--active {
  background: var(--color-primary-50);
  color: var(--text-primary);
  font-weight: 500;
}
.nav-item--active::before {
  position: absolute;
  top: 12px;
  left: 0;
  width: 4px;
  height: 24px;
  border-radius: 2px;
  background: var(--action-primary);
  content: '';
}
</style>
