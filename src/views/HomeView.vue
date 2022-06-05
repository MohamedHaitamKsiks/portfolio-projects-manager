<script setup>
    import ProjectCard from '../components/ProjectCard.vue';
import router from '../router';
</script>


<template>
    <div class="row m-5">
        <ProjectCard v-for="project in projects" :id="project.id"/>
        <button @click="onAddProject" class="btn btn-primary m-1 m-5 shadow " style="width: 10rem;height: 10rem; border-radius: 25%; font-size: larger;">Add Project</button>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                projects: []
            }
        }, 
        mounted() {
            this.projects = window.projectsAPI.getProjects();
            console.log(this.projects);
        },
        methods: {
            onAddProject() {
                router.push('/create')
            }
        }

}
</script>