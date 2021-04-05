<template>
  <div>
    <app-navigation />
    <div class="m-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation';

export default {
  name: 'App',
  components: { 'app-navigation': Navigation },
};
</script>
<style>

</style>
