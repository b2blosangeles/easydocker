<template>
    <span class="text-left">
        Switch Branch
        <select class="form-control" :required="true" @change="onBranchSelect($event)" v-model="form.branch">
            <option 
            v-for="option in branches" 
            v-bind:value="option"
            :selected="option.branch ==  form.branch"
            >{{ option }}</option>
        </select>
        <button type="button" class="btn btn-primary m-1" v-on:click="switchBranch()">Confirm</button>
    </span>
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
            let me = this;
            me.form.branch = event.target.value;
        },
        switchBranch() {
            let me = this;
            me.root.dataEngine().switchBranch(me.$parent.cfg.data.serverName, me.form.branch, function(result) {
                me.root.vHostList().getVHostList();
                me.$parent.close();
            });
        }
    }
}
</script>
 
<style>
</style>