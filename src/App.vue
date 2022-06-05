<script setup>
    import {RouterView} from 'vue-router';
    import Navbar from './components/Navbar.vue';
</script>

<template>
    <header>
        <Navbar />
    </header>
    <section class="main-section">
        <RouterView />
    </section>
</template>

<script>
    
</script>

<style>
</style>
