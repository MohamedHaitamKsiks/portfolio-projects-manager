<script setup>
    import router from '../router';
    import { useRoute } from 'vue-router';
import ImportedImage from '../components/ImportedImage.vue';
</script>


<template>
    <div class="m-5"> 
        <!--project name-->
        <div class="form-group m-2">
            <label for="name">Project's title</label>
            <input type="text" class="form-control" id="name" placeholder="Enter project tile" v-model="project.title"/>
        </div>

        <!--project link-->
        <div class="form-group m-2">
            <label for="link">Project's link</label>
            <input type="text" class="form-control" id="link" placeholder="Enter link of the project" v-model="project.link"/>
        </div>

        <!--description-->
        <div class="form-group m-2">
            <label for="description">Description</label>
            <textarea class="form-control" id="description" v-model="project.description"></textarea>
        </div>

        <!--project year-->
        <div class="form-group m-2">
            <label for="year">Project's date</label>
            <input type="text" class="form-control" id="year" placeholder="Enter date of the project" v-model="project.year"/>
        </div>

        <!-- type-->
        <div class="form-group m-2">
            <label for="type">Project type</label>
            <select class="form-control" id="type" v-model="project.type">
                <option v-for="projectType in projectTypes">{{ projectType }}</option>
            </select>
        </div>

        <!--tools-->
        <li v-for="(tool, index) in tools">
            <input :id="'tool-' + index" :value="tool" name="tool" type="checkbox" v-model="project.tools" />
            <label :for="'tool-' + index">{{ tool }}</label>
        </li>

        <!--images-->
        <div class="form-group m-2">
            <div class="m-1 row">
                <ImportedImage v-for="(file, index) in imageFiles" :file="file" :index="index" :main="project.main" @close="removeImage" @select="project.main=index"/>
            </div>

            <label for="images">Images</label>
            <input type="file" class="form-control" id="images" ref="images"/>
            <button class="btn btn-primary" @click="addImage">Add Image</button>
        </div>

        <div class="form-group">
            <button class="btn btn-warning m-2" @click="onBack">Back</button>
            <button class="btn btn-primary m-2" @click="onSave">Save</button>
        </div>

        <span v-if="errorVisible" class="alert alert-danger m-2">
            {{ errorMessage }}
        </span>

    </div>
</template>




<script>
    export default {
        data() {
            return {
                //different project types
                projectTypes: [
                    'WEB Application',
                    'Desktop Application',
                    'Mobile Application'
                ],
                //tools used
                tools: [
                    'C', 'C++', 'Java', 'HTML', 'CSS', 'Bootstrap', 'JS', 
                    'VueJS', 'NodeJS', 'ExpressJS', 'Godot', 'Python', 'OpenGL'
                ],
                project: {},
                imageFiles: [],
                unsavedImageFiles: [],
                create: true,
                errorMessage: '',
                errorVisible: false
            }
        },
        mounted() {
            //check if we are editing or creating new project
            this.create = useRoute().path == '/create';
            console.log(this.create);

            //create
            if (this.create){
                this.project = window.projectsAPI.createProject();
            }
            //edit
            else {
                let projectId = useRoute().params.id;
                this.project = window.projectsAPI.getProjectByID(projectId);
                //load images
                this.project.images.forEach((image) => {
                    let file = {
                        name: image,
                        path: 'tmp/images/' + this.project.id + '/' + image
                    };
                    this.imageFiles.push(file);
                });
                console.log(this.imageFiles)
            }
            //
            console.log(this.project);
            //on import image
            window.projectsAPI.getImportedImage((newImage) => {
                this.imageFiles.push(newImage);
                this.unsavedImageFiles.push(newImage);
                console.log(this.imageFiles);
            });

            //on save complete
            window.projectsAPI.saveProjectsComplete(() => {
                router.push('/');
            });
        }, 
        methods: {
            onBack() {
                //delete created project
                if (this.create) {
                    window.projectsAPI.deleteProjectByID(this.project.id);
                }
                else {
                    this.unsavedImageFiles.forEach((image) => {
                        window.projectsAPI.deleteImage(this.project.id, image.name);
                    });
                }
                router.push('/');
            },
            showErrorMessage(message) {
                this.errorMessage = message;
                this.errorVisible = true;
            },
            onSave() {
                //verify if can save
                if (this.project.title == ''){
                    this.showErrorMessage('Title Empty!');
                    return;
                }
                else if (this.project.type == '') {
                    this.showErrorMessage('Type Empty!');
                    return;
                }
                else if (this.project.tools.length == 0) {
                    this.showErrorMessage('No tools used!');
                    return;
                }
                else if (this.imageFiles.length == 0) {
                    this.showErrorMessage('No Image!');
                    return;
                }
                else if (this.project.year== '') {
                    this.showErrorMessage('Year Empty!');
                    return;
                }

                //save images to project object
                this.project.images = [];
                this.imageFiles.forEach((file) => {
                    this.project.images.push(file.name);
                });
                //add projec to list
                let projects = window.projectsAPI.getProjects();

                //create 
                if (this.create)
                    projects.push(this.project);
                else{
                    let index = projects.findIndex((project) => {
                        return project.id == this.project.id;
                    });
                    projects[index] = this.project;
                }

                //save projects
                window.projectsAPI.saveProjects(JSON.stringify(projects));
            },
            addImage() {
                if (this.$refs.images.files.length == 0){
                    return;
                }
                //create image
                let imageFilePath = this.$refs.images.files[0].path;
                console.log(imageFilePath);

                window.projectsAPI.importImage(this.project.id, imageFilePath);
            },  
            removeImage(imageName, index) {
                if (index == this.project.main) {
                    this.project.main = 0;
                }
                //get image name
                console.log(imageName);
                //delete image from array
                this.imageFiles = this.imageFiles.filter((image) => {
                    return image.name != imageName;
                });
                //
                window.projectsAPI.deleteImage(this.project.id, imageName);
            }

        }
    }
</script>

