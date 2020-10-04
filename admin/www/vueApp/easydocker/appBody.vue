<template>
    <div class="card shadow m-2 mr-1">
        <span v-if="isSignin()">
          <v-host-form v-if="root.module=='form'"></v-host-form>
          <v-host-list v-if="root.module=='list'" ref="vHostList"></v-host-list>
        </span>
        <signin-form  v-if="!isSignin()"></signin-form>
    </div>
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root :  this.$parent.root
        }
    },
    mounted() {
        localStorage.setItem('easydockerFP', new Date().toString());
        let v = localStorage.getItem('easydockerFP')
        console.log(v)
    },
    methods : {
        isSignin() {
            return true
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'signinForm' : '/vueApp/easydocker/signinForm.vue'
        }, 
        TPL :{
            'vHostList' : '/vueApp/easydocker/vHostList.vue',
            'vHostForm' : '/vueApp/easydocker/vHostForm.vue'
        }
    })
}
</script>
 
<style>

</style>
