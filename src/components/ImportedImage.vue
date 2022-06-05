<template>
    <div :class="'col-auto import-image ' + fadeClass + mainClass" >   
        <img :src="file.path" width="64" @click="onImageClick"/>
        <button type="button" class="btn-close" aria-label="Close" @click="onClose"></button>
    </div>
</template>

<script>
    export default {
        props: {
            file: Object,
            index: Number,
            main: Number
        },
        emits: ['close', 'select'],

        data() {
            return {
                deleted: false,
                fadeClass: '',
            }
        },  
        methods: {
            onClose()  {
                if (!this.deleted) {
                    this.deleted = true;
                    this.fadeClass = 'import-image-fadeout ';
                    setTimeout(() => {
                        this.$emit('close', this.file.name, this.index);
                        this.fadeClass = '';
                        this.deleted = false;
                    }, 200);
                }
            },
            onImageClick() {
                this.$emit('select', this.index);
            }
        },
        computed: {
            mainClass() {
                return (this.index == this.main) ? 'alert alert-success' : 'alert alert-light'
            }
        }
    }
</script>

<style>

    .import-image {
        opacity: 100%;
        transition: all 0.2s;
    }

    .import-image-fadeout {
        opacity: 0%;
    }


</style>