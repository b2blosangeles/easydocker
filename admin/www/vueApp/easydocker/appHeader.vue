<template>
    <div class="card shadow m-2">
        <div class="card-body alert-warning border border-warning">
            <div class="container-fluid m-0">
                <div class="row">
                    <div class="col-2 p-0 m-0 text-left">
                        <span v-if="isSignin()" >
                            <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="restartProxy()">
                                    Restart proxy
                            </a>
                            <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="removeAllHosts()">
                                    Remove All Hosts
                            </a>
                        </span>
                    </div>
                    <div class="col-8 p-0 m-0 text-center">
                            <h4>EasyDocker Admin.</h4>
                    </div>
                    <div class="col-2 p-0 m-0 text-right">
                        <span v-if="isSignin()" >
                            <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="addVHost()" v-if="isSignin()" >
                                    Add a host
                            </a>

                            <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="signoff()">
                                    signoff
                            </a>
                        </span>
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
            root :  this.$parent.root,
            list : []
        }
    },
    mounted() {
        let v = localStorage.getItem('easydockerFP');
        this.root.token = v;
    },
    methods :{
        isSignin() {
            return (!this.root.token) ? false : true
        },
        signin() {
            var me = this;
            localStorage.setItem('easydockerFP', new Date().toString());
            let v = localStorage.getItem('easydockerFP');
            me.root.token = v;
        },
        signoff() {
            localStorage.removeItem('easydockerFP');
            this.root.token = null;
        },
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
