<template>
    <div class="card shadow m-2">
        <div class="card-body alert-warning border border-warning">
            <div class="container-fluid m-0">
                <div class="row">
                    <div class="col-2 p-0 m-0 text-left">
                    </div>
                    <div class="col-8 p-3 m-0 text-center">
                            <h3>EasyDocker Admin.</h3>
                    </div>
                    <div class="col-2 p-0 m-0 text-right">
                    </div>
                </div>
            </div>
            <div class="container-fluid mt-3 text-left" v-if="root.isSignin()">
                <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="clickMenu('database')">
                    Databases
                </a>
                <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="clickMenu('list')">
                    Web Sites
                </a>
                <a class="btn btn-sm btn-danger m-1 pull-right" href="JavaScript:void(0)" v-on:click="restartProxy()">
                    Restart proxy
                </a>
                <a class="btn btn-sm btn-danger m-1 pull-right" href="JavaScript:void(0)" v-on:click="removeAllHosts()">
                    Remove All Hosts
                </a>
                <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="root.signOff()">
                    signoff
                </a>
            </div>
        </div> 
    </div> 
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root :  this.$parent.root,
            list : [],
            module : ''
        }
    },
    mounted() {
        let v = localStorage.getItem('easydockerFP');
        this.root.token = v;
    },
    methods :{
        clickMenu(v) {
            var me = this;
            me.$parent.module = v;
        },
        restartProxy() {
            var me = this;
            me.$parent.dataEngine().restartProxy();
        },
        removeAllHosts() {
            var me = this;
            me.$parent.dataEngine().runPost('/api', 'removeAllHosts', {}, function(result) {
                console.log(result);
            } , function(result) {
                console.log(result);
            });
        }
    }
}
</script>
 
<style>
</style>
