<template>
    <div class="card shadow m-2 text-left">
        <div class="text-right p-3 pb-0" v-if="module!=='form'">
            <a class="btn btn-sm btn-success m-3 mb-0 pull-right" href="JavaScript:void(0)" v-on:click="addVHost()" >
                Add a host
            </a>
        </div>
        <v-host-form v-if="module==='form'"></v-host-form>
        <div class="card-body card-list-section  mt-0" v-if="module!=='form'">
            <div class="list-group" v-for="item in  root.commonData.list">
                <div class="list-group-item list-group-item-action flex-column align-items-start m-1">

                    <div class="container-fluid m-0">
                        <div class="row">
                            <div class="col-2 p-0 m-0 text-left">
                                <h3><b>{{item.name}}</b></h3>
                            </div>
                            <div class="col-10 p-0 m-0 text-left">
                                <span class="ml-0">
                                    Port : <span class="text-info"> {{outerPorts(item)}}</span>
                                </span>
                                <span class="ml-3">
                                    gitHub : <span class="text-info"> {{item.gitHub}}</span>
                                </span>
                                <select-branch v-bind:servername="item.name" v-bind:branch="item.branch"></select-branch>
                                <span class="ml-0">
                                    branch :
                                    <button class="btn btn-sm btn-success" href="JavaScript:void(0)" v-on:click="switchBranch(item)">{{item.branch}}</button>
                                </span>
                                <a class="btn btn-sm btn-warning m-1" href="JavaScript:void(0)" v-on:click="deleteVirtualServer(item.name)">
                                    Delete
                                </a>
                                <a class="btn btn-sm btn-info m-1" href="JavaScript:void(0)" v-on:click="resetVHost(item.name)">
                                    Reboot
                                </a>
                                <a class="btn btn-sm btn-danger m-1" href="JavaScript:void(0)" v-on:click="stopVHost(item.name)">
                                    Stop
                                </a>
                                <a class="btn btn-sm btn-success m-1" href="JavaScript:void(0)" v-on:click="pullCode(item.name)">
                                    Pull code
                                </a>
                            </div>
                        </div>
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
            list : [],
            root :  this.$parent.root,
            currentHost : '',
            module : ''
        }
    },
    mounted() {
        var me = this;
        setTimeout(
            function() {
                me.getVHostList()
            }, 50
        );
    },
    methods : {
        addVHost() {
            var me = this;
            me.module = 'form';
        },
        getVHostList() {
            var me = this;
            me.root.dataEngine().getVHostList();
        },
        deleteVirtualServer(serverName) {
            var me = this;
            me.root.popUp().show({
                insideModule: 'confirmDelete',
                data : {
                    serverName : serverName
                }
            });
        },

        switchBranch(item) {
            let me = this,
                data = {
                    serverName  : item.name,
                    branch      : item.branch
                };

            me.root.popUp().show({
                insideModule: 'switchBranch',
                data : data
            });            
        },

        stopVHost(serverName) {
            var me = this;
            me.root.dataEngine().stopVHost(serverName);
        },
        pullCode(serverName) {
            var me = this;
            me.root.dataEngine().pullCode(serverName);
        },       
        resetVHost(serverName) {
            var me = this;
            me.root.dataEngine().resetVHost(serverName);
        },
        outerPorts(item) {
            var me = this;
            var str = '';
            var p = (!item || !item.docker || !item.docker.ports) ? [] : item.docker.ports;
            for (var i = 0; i < p.length; i++) {
                str += (item.unidx * 10000 + parseInt(p[i])) +','
            }
            return str.replace(/\,$/,'');
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'selectBranch' : '/vueApp/easydocker/popUpModals/selectBranch.vue',
            'vHostForm' : '/vueApp/easydocker/vHostForm.vue'
        }, 
        TPL :{}
    })
}
</script>
 
<style>
</style>