<script setup>
    import {RouterLink} from 'vue-router'
</script>

<template>
    <div v-if="visible" :class="'card project-card m-2 shadow ' + getClassAnimation" style="width: 18rem;">
        <img :src="'tmp/images/' + id + '/' + project.images[project.main]" class="card-img-top img-thumbnail project-card-img"  alt="...">
        <div class="card-body">
            <p class="card-text">
                <strong>{{ project.title }}</strong><br/>
                <RouterLink class="btn btn-primary m-1" :to="{path: '/edit/' + id}">Edit</RouterLink>
                <button class="btn btn-danger m-1" @click="deleteProject">Delete</button>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: Number
            
        },
        data() {
            return {
                project: window.projectsAPI.getProjectByID(this.id),
                deleted: false,
                visible: true
            }
        },
        methods: {
            deleteProject() {
                if (!this.deleted) {
                    this.deleted = true;
                    //delete after fade out
                    setTimeout(() => {
                        window.projectsAPI.deleteProjectByID(this.id);
                        this.visible = false;
                    }, 500);
                }
            },
        },
        computed: {
            //fade out
            getClassAnimation() {
                return this.deleted ? 'project-card-hide': ''
            }
        }
    
    }
</script>

<style>
    .project-card{
        text-align: center;
        transition: opacity 0.5s;
    }

    .project-card-hide {
        opacity: 0%;
    }

    .project-card-img {
        width: 18rem;
        height: 10rem;
        object-fit:contain;
        background-color: black;
    }


</style>
