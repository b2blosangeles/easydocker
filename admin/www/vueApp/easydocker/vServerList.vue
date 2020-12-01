<template>
    <div class="card shadow m-2 text-left">
        <div class="p-3 pb-0" >
            <div class="row">
                <div class="col-6 p-3 m-0 text-left">
                    <h3 v-if="module!=='form'"  class="ml-4 text-capitalize">{{serverType}} List</h3>
                    <h3 v-if="module==='form'"  class="ml-4 text-capitalize">Add a {{serverType}}</h3>
                </div>
                <div class="col-6 p-0 m-0 text-right">
                    <a class="btn btn-sm btn-success m-3 mb-0 pull-right"
                        href="JavaScript:void(0)" v-if="module!=='form'" v-on:click="addVServer()" >
                        Add a {{serverType}}
                    </a>
                    <a class="btn btn-sm btn-secondary m-3 mb-0 pull-right" href="JavaScript:void(0)" v-if="module==='form'" v-on:click="cancel()" >
                        Cancel
                    </a>
                </div> 
            </div>
        </div>
        <v-form-web-server v-if="module==='form' && serverType === 'webserver'" server-type="webserver"></v-form-web-server>
        <v-form-db-server v-if="module==='form' && serverType === 'database'" server-type="database"></v-form-db-server>
        <div class="card-body card-list-section  mt-0" v-if="module!=='form'">
            <div class="list-group" v-for="item in  list">
                <div class="list-group-item list-group-item-action flex-column align-items-start m-1">
                    <div class="container-fluid m-0">
                        <div class="row">
                            <div class="col-2 p-0 m-0 text-left">
                                {{item.serverType}}<br/>
                                <h3><b>{{item.name}}</b></h3>
                            </div>
                            <div class="col-10 p-0 m-0 text-left">
                                <span class="ml-0">
                                    Type: <span class="text-info">{{item.docker.type}}</span> 
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
                                <a class="btn btn-sm btn-warning m-1" href="JavaScript:void(0)" v-on:click="deleteVirtualServer(item.name, item.serverType)">
                                    Delete
                                </a>
                                <a class="btn btn-sm btn-info m-1" href="JavaScript:void(0)" v-on:click="resetVServer(item)">
                                    Start
                                </a>
                                <a class="btn btn-sm btn-danger m-1" href="JavaScript:void(0)" v-on:click="stopVServer(item)">
                                    Stop
                                </a>
                                <a class="btn btn-sm btn-success m-1" href="JavaScript:void(0)" v-on:click="pullCode(item)">
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
    props : ['serverType'],
    data: function() {
        let me = this;
        return {
            list : [],
            root :  this.$parent.root,
            currentServer : '',
            module : ''
        }
    },
    mounted() {
        var me = this;
        setTimeout(
            function() {
                me.getVServerList()
            }, 50
        );
    }, 
    watch: {
        serverType: function(val) {
          var me = this;
          me.getVServerList();
      }
    },
    methods : {
        cancel() {
            var me = this;
            me.module = '';
        },
        addVServer() {
            var me = this;
            me.module = 'form';
        },
        getVServerList() {
            var me = this;
            me.root.dataEngine().getVServerList(
                false,
                function(result) {
                    me.list = result.list.filter(function(item) {
                        return (item.serverType === me.serverType)
                    });
                    me.module = '';
                }
            );
        },
        deleteVirtualServer(serverName, serverType) {
            var me = this;
            me.root.popUp(me).show({
                insideModule: 'confirmDelete',
                data : {
                    serverName : serverName,
                    serverType : serverType
                }
            });
        },

        switchBranch(record) {
            let me = this,
                data = {
                    serverName  : item.name,
                    branch      : item.branch
                };

            me.root.popUp(me).show({
                insideModule: 'switchBranch',
                data : data
            });            
        },

        stopVServer(record) {
            var me = this;
            me.root.dataEngine().stopVServer(record);
        },
        pullCode(record) {
            var me = this;
            me.root.dataEngine().pullCode(record);
        },       
        resetVServer(serverName, serverType) {
            var me = this;
            me.root.dataEngine().resetVServer(serverName, serverType);
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
            'selectBranch'   : '/vueApp/easydocker/selectBranch.vue',
            'vFormWebServer' : '/vueApp/easydocker/vFormWebServer.vue',
            'vFormDbServer'  : '/vueApp/easydocker/vFormDbServer.vue'
        }, 
        TPL :{}
    })
}
</script>
 
<style>
.text-capitalize {
  text-transform: capitalize;
}
</style>