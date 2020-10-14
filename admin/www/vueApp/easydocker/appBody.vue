<template>
    <div>
        {{/* oot.auth.token */}}
        <span v-if="root.isSignin()">
          <v-host-form v-if="root.module=='form'"></v-host-form>
          <v-host-list v-if="root.module=='list'" ref="vHostList"></v-host-list>
          <db-mysql-list v-if="matrix('database')" ref="vHostList"></db-mysql-list>
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
        matrix(v) {
            var me = this;
            return (v === 'database' && me.root.module=='list' && me.root.menu=='database') ? true :
            false;
        }
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
