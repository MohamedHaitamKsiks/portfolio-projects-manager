<script setup>
    import { RouterLink, useRoute } from 'vue-router'
    import router from '../router';
</script>

<template>
    <nav :class="'navbar navbar-dark bg-dark p-2 shadow-lg nav-animation ' + showNavClass">
        <a class="navbar-brand">Profolio Project Manager</a>
        <div class="d-flex">
            <button class="btn btn-outline-success m-1" @click="saveProjects">Save</button>
            <button class="btn btn-outline-warning m-1" @click="reloadProjects">Reload</button>
        </div>
    </nav>
    
    <div :class="'alert alert-success m-2 save-complete ' + fadeOutClass">
        Save Complete!
    </div>
</template>

<script>
    export default {
        data() {
            return {
                saveComplete: false
            }
        },
        mounted() {
            window.projectsAPI.onSaveComplete(() => {
                this.saveComplete = true;
                setTimeout(() => {
                    this.saveComplete = false;
                }, 3100);
            })
        },
        methods: {
            reloadProjects() {
                window.projectsAPI.loadProjects();
                router.go(0);
            },
            saveProjects() {
                window.projectsAPI.saveAll();
            }
        },
        computed: {
            fadeOutClass() {
                return this.saveComplete ? 'save-complete-fadeout' : '';
            },
            showNavClass() {
                return useRoute().path == '/' ? '' : 'nav-hide';
            }
        }
    }
</script>

<style>

    .save-complete {
        opacity: 0%;
        text-align: center;
        transition: all 0.5s ease-out;
        position: relative;
        top: 0px;
    }

    .save-complete-fadeout {
        opacity: 100%;
        position: relative;
        top: 16px;
    }

    .nav-animation {
        transition: all 0.3s;
    }

    .nav-hide {
        transform: translateY(-160px);
    }

</style>