// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('projectsAPI', {
    loadProjects: () => ipcRenderer.sendSync('load-projects'),
    getProjects: () => ipcRenderer.sendSync('get-projects'),
    getProjectByID: (id) => ipcRenderer.sendSync('get-project-id', id),
    createProject: () => ipcRenderer.sendSync('create-project'),
    saveProjects: (projects) => ipcRenderer.send('save-projects', projects),
    saveProjectsComplete: (onSave) => ipcRenderer.on('save-projects-complete', (event) => onSave()),
    deleteProjectByID: (id) => ipcRenderer.send('delete-project-id', id),
    importImage: (project, imagePath) => ipcRenderer.send('import-image', project, imagePath),
    getImportedImage: (onImport) => ipcRenderer.on('import-image-reply',(event, image) => onImport(image)),
    deleteImage: (projectId, image) => ipcRenderer.send('delete-image', projectId, image),
    saveAll: () => ipcRenderer.send('save-all'),
    onSaveComplete: (onSave) => ipcRenderer.on('save-all-complete', (event) => onSave()),
});


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

