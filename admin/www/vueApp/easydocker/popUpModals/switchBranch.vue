<template>
    <div>switchBranch => {{this.$parent.cfg.data.serverName}}</div>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            branches : [],
            root     :  this.$parent.root
        }
    },
    mounted() {
        let me = this;
        me.gitRemoteBranchs(me.$parent.cfg.data.serverName);
    },
    methods :{
        gitRemoteBranchs(serverName) {
            var me = this;
            me.root.dataEngine().gitSiteBranchs(serverName, function(result) {
                console.log(result);
                return true;

                if (result.status === 'success') {
                    me.branches = result.list;
                } else {
                    me.branches = [];
                    me.errors.gitHub = result.message;
                }
            });
        },
    }
}
</script>
 
<style>
</style>