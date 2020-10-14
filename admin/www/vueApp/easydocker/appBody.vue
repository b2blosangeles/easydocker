<template>
    <div>
        <span v-if="root.isSignin()">
          <v-host-form v-if="root.matrix('form')"></v-host-form>
          <v-host-list v-if="root.matrix('list')" ref="vHostList"></v-host-list>
          <db-mysql-list v-if="root.matrix('database')" ref="vHostList"></db-mysql-list>
        </span>
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
        var me = this;
    },
    methods : {
    },
    components: VUEApp.loadComponents({
        LOAD    : {
           
        }, 
        TPL :{
            'vHostList' : '/vueApp/easydocker/vHostList.vue',
            'vHostForm' : '/vueApp/easydocker/vHostForm.vue',
            'dbMysqlList':'/vueApp/easydocker/dbMysqlList.vue'
        }
    })
}
</script>
 
<style>

</style>
