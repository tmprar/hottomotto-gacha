<script setup lang="ts">
import {
  ConfirmPopup,
  DynamicDialog,
  ProgressSpinner,
  Toast,
} from 'primevue'
</script>

<template>
  <NuxtLayout>
    <Toast />
    <ConfirmPopup />
    <DynamicDialog />
    <Suspense>
      <NuxtPage />

      <template #fallback>
        <div class="h-full flex items-center justify-center">
          <ProgressSpinner />
        </div>
      </template>
    </Suspense>
  </NuxtLayout>
</template>
