const fs = require('fs');
const fse = require('fs-extra');
const uuid = require('uuid');

const { parse } = require('path');

const projectsAPI = {
    //create temporary folder
    projectsPath: '/home/ksiks_wa3r/Documents/MY WORKSPACE/JavaScriptWorkspace/portfolio/portfolio/public/projects',
    createTemp() {
        fse.copySync(this.projectsPath, 'dist/tmp', {overwrite: true});
    },
    //get projects object
    loadProjects(event) {
        //create temp folder for the projects
        console.log('load project')
        this.createTemp();
        //load projects json
        global.projects = JSON.parse(fs.readFileSync('dist/tmp/projects.json', { encoding: 'ascii' }));
        event.returnValue = global.projects
    },
    getProjects(event) {
        event.returnValue = global.projects
    },
    //get specific project by it's id
    getProjectByID(event, id) {
        let project;
        //look for project by id
        for (let i = 0; i < global.projects.length; i++) {
            if (global.projects[i].id == id) {
                project = Object.assign({}, global.projects[i]);
                break;
            }
        }
        event.returnValue = project;
    },
    saveTmpProjects(){
        fs.writeFile('dist/tmp/projects.json', JSON.stringify(global.projects, null, 4), (err) => {
            if (err) throw err;
        })
    },
    deleteProjectByID(event, id) {
        //look for project by id
        for (let i = 0; i < global.projects.length; i++) {
            if (global.projects[i].id == id) {
                global.projects.splice(i);
                break;
            }
        }
        //save new json
        this.saveTmpProjects();

        //delete images directory
        fse.remove('dist/tmp/images/' + id, (err) => {
            if (err) throw err;
        });
    },
    //save project
    createProject(event) {
        //create project id
        let projectId = uuid.v4();
        //create new project object
        let newProject = {
            id: projectId,
            title: '',
            description: '',
            type: '',
            year: '',
            link:'',
            tools: [],
            images: [],
            main: 0
        }
        //create image folder
        fs.mkdirSync('dist/tmp/images/' + projectId);
        //return new project object
        event.returnValue = newProject;
    },
    saveProjects(event, projects) {
        //save project to projects
        global.projects = JSON.parse(projects);
        console.log(global.projects)
        //save new json
        this.saveTmpProjects();

        event.reply('save-projects-complete');
    },
    importImage(event, projectId, imagePath) {
        //image object
        let image = {
            id: uuid.v4(),
            extension: imagePath.split('.')[1],
            name: '',
            path: ''
        }

        image.name = image.id + '.' + image.extension;
        image.path = 'tmp/images/' + projectId + '/' +  image.id + '.' + image.extension;

        console.log(image);
        //copy image
        fs.copyFile(imagePath, 'dist/' + image.path, (err) => {
            if (err) throw err; 
            event.reply('import-image-reply', image);
        });
    },
    deleteImage(event, projectId, image) {
        let imagePath = 'dist/tmp/images/' + projectId + '/' + image;
        fs.rm(imagePath, (err) => {
            if (err) throw err;
        });
    },
    saveAll(event) {
        //copy images
        fse.copy('dist/tmp', this.projectsPath, {overwrite: true}, (err) => {
            if (err) throw err;
            event.reply('save-all-complete');
        });
        
    }
}

module.exports = projectsAPI;