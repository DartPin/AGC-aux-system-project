<template>
    <div>
        <v-icon v-if="show" @click="show = !show">mdi-arrow-down-drop-circle</v-icon>
        <v-icon v-if="!show" @click="show = !show">mdi-arrow-up-drop-circle</v-icon>
    </div>
</template>

<script>
    export default {
        model:{
            prop: 'show',
            event: 'returnEvent'
        },
        data(){
            return{
                show: false
            }
        },
        watch: {
            show(newValue, oldValue) {
                this.$emit('returnEvent', this.show)
            }
        }
    }
</script>