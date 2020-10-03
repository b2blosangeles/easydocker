<template>
    <div class="text-left">
        switchBranch
        <select class="form-control" :required="true" @change="onBranchSelect($event)" v-model="form.branch">
            <option 
            v-for="option in branches" 
            v-bind:value="option"
            :selected="option.branch ==  form.branch"
            >{{ option }}</option>
        </select>
    </div>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            branches : [],
            root     :  this.$parent.root,
            form     : {
                branch : this.$parent.cfg.data.branch
            }
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
        onBranchSelect(event) {
            var me = this;
            // alert(event.target.value);
            me.$parent.close() 
            // me.form.branch = event.target.value;
            // me.getSiteDocker();
        }
    }
}
</script>
 
<style>
</style>