<template>
    <div>
        <span v-if="root.isSignin()">
          <v-server-list v-if="root.matrix('list')" ref="vServerList"></v-server-list>
          <v-server-list v-if="root.matrix('database')" ref="vServerList"></v-server-list>
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
            'vServerList' : '/vueApp/easydocker/vServerList.vue',
            'dbMysqlList':'/vueApp/easydocker/dbMysqlList.vue'
        }
    })
}
</script>
 
<style>

</style>
