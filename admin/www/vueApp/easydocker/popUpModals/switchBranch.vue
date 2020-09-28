<template>
    <div>switchBranch</div>
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
        console.log('mounted switch ' + me.root.commonData.popUp.serverName);
    },
    methods :{
        gitRemoteBranchs(gitRecord) {
            var me = this;
            me.gitValidation();
            me.$forceUpdate();
            if (me.isformValid()) {
                me.root.dataEngine().gitRemoteBranchs(gitRecord, function(result) {
                    if (result.status === 'success') {
                        me.branches = result.list;
                    } else {
                        me.branches = [];
                        me.errors.gitHub = result.message;
                    }
                });
            }
        },
    }
}
</script>
 
<style>
</style>