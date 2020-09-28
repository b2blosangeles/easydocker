<template>
    <span>
        <p>Please confirm if you need remove the virtual host "{{this.$parent.cfg.data.serverName}}"</p>
        <button type="button" class="btn btn-primary m-1" v-on:click="execDeletVirtualServer()">Confirm</button>
    </span>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            root :  this.$parent.root
        }
    },
    mounted() {
        let me = this;
    },
    methods :{
        execDeletVirtualServer() {
            let me = this;
            let serverName = me.$parent.cfg.data.serverName;
            me.root.dataEngine().removeVirtualHost(serverName);
        }
    }
}
</script>
 
<style>
</style>