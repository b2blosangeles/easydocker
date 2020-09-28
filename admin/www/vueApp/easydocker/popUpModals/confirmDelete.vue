<template>
    <span>
        <p>Please confirm if you need remove the virtual host "{{this.$parent.$parent.commonData.popUp.serverName}}"</p>
        <button type="button" class="btn btn-primary m-1" v-on:click="execDeletVirtualServer()">Confirm</button>
    </span>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
        }
   },
   methods :{
        execDeletVirtualServer() {
            let serverName = this.$parent.$parent.commonData.popUp.serverName;
            this.$parent.$parent.dataEngine().removeVirtualHost(serverName);
        }
   }
}
</script>
 
<style>
</style>