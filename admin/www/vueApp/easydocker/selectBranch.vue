<template>
    <div class="text-left">
        <span v-if="!branches.length || !isCurrentServer()">{{branch}} 
            <a href="JavaScript: void(0)" v-on:click="gitRemoteBranchs()">switch branch</a>
        </span>
        <div v-if="branches.length && isCurrentServer()" class="border border-3 p-1">
            Switch Branch
            <div class="container m-2">
                <div class="row">
                    <div class="col-3 p-0 m-0 text-left" v-for="item in branches">
                        <b v-if="item === branch">*</b>
                        <a href="JavaScript: void(0)" v-on:click="switchBranch(item)">{{item}}</a>
                    </div>
                </div>
            </div>
        <div>
    </div>
</template>

<script>
module.exports = {
    props: ['servername', 'branch'],
    data: function() {
        return {
            branches :  [],
            root     :  this.$parent.root,
            form     : {
                branch : this.branch
            }
        }
    },
    mounted() {
        let me = this;
    },
    methods :{
        isCurrentServer() {
            return (this.$parent.currentServer === this.servername) ? true : false;
        },
        gitRemoteBranchs() {
            var me = this;
            me.$parent.currentServer = me.servername;
            me.root.dataEngine().gitSiteBranchs(me.servername, function(result) {
                if (result.status === 'success') {
                    me.branches = result.list.branches;
                } else {
                    me.branches = [];
                }
            });
        },
        switchBranch(branch) {
            var me = this;
            me.branches = [];
            me.root.dataEngine().switchBranch(me.servername, branch, function(result) {
                me.$parent.getVServerList();
                me.branches = [];
            });        
        }
    }
}
</script>
 
<style>
</style>