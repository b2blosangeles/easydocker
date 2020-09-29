<template>
    <div>
        switchBranch => {{this.$parent.cfg.data.serverName}} - {{this.$parent.cfg.data.branch}}
        {{branches}}
    </div>
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
                if (result.status === 'success') {
                    me.branches = result.list.branches;
                } else {
                    me.branches = [];
                }
            });
        },
    }
}
</script>
 
<style>
</style>