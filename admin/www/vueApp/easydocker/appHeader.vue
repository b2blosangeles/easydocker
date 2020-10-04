<template>
    <div class="card shadow m-2">
        <div class="card-body alert-warning border border-warning">
            <div class="container-fluid m-0">
                <div class="row">
                    <div class="col-2 p-0 m-0 text-left">
                        <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="restartProxy()">
                                Restart proxy
                        </a>
                        <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="removeAllHosts()">
                                Remove All Hosts
                        </a>
                    </div>
                    <div class="col-8 p-0 m-0 text-center">
                            <h4>EasyDocker Admin.</h4>
                    </div>
                    <div class="col-2 p-0 m-0 text-right">
                        <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="addVHost()">
                                Add a host
                        </a>
                    </div>
                </div>
            </div>
        </div> 
    </div> 
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            list : []
        }
    },
    mounted() {
        localStorage.setItem('easydockerFP', new Date().toString());
    },
    methods :{
        addVHost() {
            var me = this;
            me.$parent.module = (me.$parent.module === 'form') ? 'list' : 'form';
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
