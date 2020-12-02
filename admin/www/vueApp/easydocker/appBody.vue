<template>
    <div>
        <span v-if="root.isSignin()">
          <!--v-server-list v-if="root.matrix('webservers')" server-type="webserver" ref="vServerList"></v-server-list>
          <v-server-list v-if="root.matrix('databases')" server-type="database" ref="vServerList"></v-server-list-->
          <v-server-list v-if="root.matrix('webservers')" server-type="webserver" ref="vServerList"></v-server-list>
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
            'vServerList' : '/vueApp/easydocker/vServerList.vue'
        }
    })
}
</script>
 
<style>

</style>
