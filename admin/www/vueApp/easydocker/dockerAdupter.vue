<template>
    <div>  
      <component v-bind:is="dockerPlugin()" v-bind:item="item"></component>
    </div>
</template>
 
<script>
module.exports = {
    props : ['item'],
    data: function() {
        return {
        }
    },
    mounted () {
        var me = this;
        var cfg = {};
        cfg['dockerPlugO' + me.item.name] = '/_dockerAdupter/ui/' + me.item.serverType + '/' + me.item.name + '/main.js.vue';
        VUEApp.dynamicLoadComponent(cfg, me);
        me.$mount();
    },
    methods :{
        dockerPlugin() {
            return 'docker-plug-o' + this.item.name
        }
    }
}
</script>
 
<style>

</style>