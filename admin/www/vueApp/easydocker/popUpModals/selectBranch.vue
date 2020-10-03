<template>
    <div class="text-left">
        <span v-if="!branches.length">{{branch}} 
            <a href="JavaScript: void(0)" v-on:click="gitRemoteBranchs()">switch branch</a>
        </span>
        <span v-if="branches.length">
        Switch Branch
        <div class="container">
            <div class="row">
                <div class="col-3 p-0 m-0 text-left" v-for="item in branches">
                    <a href="JavaScript: void(0)" v-on:click="switchBranch(item)">{{item}}</a>
                </div>
            </div>
        </div>
        <select class="form-control" :required="true" @change="onBranchSelect($event)" v-model="form.branch">
            <option 
            v-for="option in branches" 
            v-bind:value="option"
            :selected="option.branch == branch"
            >{{ option }}</option>
        </select>
        <span>
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
        
        gitRemoteBranchs() {
            var me = this;
            me.root.dataEngine().gitSiteBranchs(me.servername, function(result) {
                if (result.status === 'success') {
                    me.branches = result.list.branches;
                } else {
                    me.branches = [];
                }
            });
        },
        switchBranch(b) {
            var me = this;
            me.branches = [];
            me.root.dataEngine().switchBranch(me.servername, b);        
        },
        onBranchSelect(event) {
            var me = this;
            me.branches = []
            // alert(event.target.value);
            // me.$parent.close() 
            // me.form.branch = event.target.value;
            // me.getSiteDocker();
        }
    }
}
</script>
 
<style>
</style>