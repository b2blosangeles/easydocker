<template>
    <div class="card shadow m-2 text-left">
        <div class="p-3 pb-0" >
            <div class="row">
                <div class="col-5 p-3 m-0 text-left">
                    <h3 class="ml-4 text-capitalize">
                        Server List
                    </h3>
                </div>
                <div class="col-7 p-3 m-0 text-right">
                     <span v-for="(v, k) in serverTypes">
                        <span class="pr-3"><input type="checkbox" :checked="isFilterChecked(k)" v-on:click="checkFilter(k)"><span class="pl-2">{{ v }}</span></span>
                    </span>
                </div>
            </div>
        </div>
       
        <div class="card-body card-list-section  mt-0 pt-0">
            <div class="list-group" v-if="!filteredResult().length"> 
                <div class="list-group-item list-group-item-action flex-column align-items-start m-1">
                    <div class="container-fluid m-0">
                        No result
                    </div>
                </div>
            </div>
            <div class="list-group" v-for="item in filteredResult()">
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
                                <a class="btn btn-sm btn-warning m-1" href="JavaScript:void(0)" v-on:click="deleteVirtualServer(item)">
                                    Delete
                                </a>
                                <a class="btn btn-sm btn-info m-1" href="JavaScript:void(0)" v-on:click="startVServer(item)">
                                    Start
                                </a>
                                <a class="btn btn-sm btn-danger m-1" href="JavaScript:void(0)" v-on:click="stopVServer(item)">
                                    Stop
                                </a>
                                <a class="btn btn-sm btn-success m-1" href="JavaScript:void(0)" v-on:click="pullCode(item)">
                                    Pull code
                                </a>
                                <a class="btn btn-sm btn-warning m-1" href="JavaScript:void(0)" v-on:click="viewLogs(item)">
                                    Read Logs
                                </a>
                                <a class="btn btn-sm btn-info m-1" href="JavaScript:void(0)" v-on:click="popupEditor(item)">
                                    <i class="fa fa-file-code-o mr-2" aria-hidden="true"></i>Edit Site Variabls
                                </a>
                                <docker-adupter v-bind:item="item"></docker-adupter>
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
    props : [],
    data: function() {
        let me = this;
        return {
            list : [],
            serverTypes : {
                'database'  : 'Mysql Database',
                'webServer' : 'Web Server'
            },
            serverTypeFilter : [],
            root :  this.$parent.root,
            currentServer : ''
        }
    },
    mounted() {
        var me = this;
        me.serverTypeFilter = Object.keys(me.serverTypes);
        setTimeout(
            function() {
                me.getVServerList()
            }, 50
        );
    },
    watch: {
        serverTypeFilter: function(val) {
          var me = this;
        }
    },
    methods : {
        isFilterChecked(k) {
            var me = this;
            return (me.serverTypeFilter.indexOf(k) !== -1);
        },
        checkFilter(k) {
            var me = this;
            var list = [];
            if (me.serverTypeFilter.indexOf(k) == -1) {
                me.serverTypeFilter.push(k);
            } else {
                for (var i = 0; i < me.serverTypeFilter.length; i++) {
                    if (me.serverTypeFilter[i] != k) {
                        list.push(me.serverTypeFilter[i]);
                    }
                }
                me.serverTypeFilter = list;
            }
            console.log(k);
            console.log(me.serverTypeFilter);
        },
        filteredResult() {
            var me = this;
            return me.list.filter(function(item) {
                return (me.serverTypeFilter.indexOf(item.serverType) !== -1)
            });
        },
        getVServerList() {
            var me = this;
            me.root.dataEngine().getVServerList(
                false,
                function(result) {
                    me.list = result.list;
                }
            );
        },
        deleteVirtualServer(record) {
            var me = this;
            me.root.popUp(me).show({
                insideModule: 'confirmDelete',
                data : {
                    serverName : record.name,
                    serverType : record.serverType
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
        viewLogs(record) {
            var me = this;
            me.root.dataEngine().viewLogs(record);
        },       
        startVServer(record) {
            var me = this;
            me.root.dataEngine().startVServer(record);
        },
        outerPorts(item) {
            var me = this;
            var str = '';
            var p = (!item || !item.docker || !item.docker.ports) ? [] : item.docker.ports;
            for (var i = 0; i < p.length; i++) {
                str += (item.unidx * 10000 + parseInt(p[i])) +','
            }
            return str.replace(/\,$/,'');
        },
        saveEditorContent(record, v, callback) {
            var me = this;
            var rec = {
                serverName : record.name,
                serverType : record.serverType,
                contents   : v
            };
            me.root.dataEngine().saveVserverValiables(rec, 
                function(result) {
                    callback(result);
            });
        },
        getEditorContent(record, callback) {
            var me = this;
            var rec = {
                serverName : record.name,
                serverType : record.serverType
            };
            me.root.dataEngine().getVserverValiables(rec, 
                function(result) {
                    callback(result);
            });
        },
        popupEditor(record) {
            var me = this;
            me.root.popUp(me).show({
                insideModule: 'iframeObj',
                data : {
                    url : '/aceEditor.ect?mode=json',
                    item : record
                },
                noDefaultCancel : true
            }); 

            document._iFrameBridge.close = (function(me) {
                return function(v) {
                    me.root.popUp(me).close();
                }
            })(me);

            document._iFrameBridge.save = (function(me, item) {
                return function(v) {
                   me.saveEditorContent(item, v, function(result) {
                       me.root.popUp(me).close();
                   })
                }
            })(me, record);

            document._iFrameBridge.loadContents = (function(me, item) {
                return function(callback) {
                   me.getEditorContent(item, function(result) {
                       callback(result.data);
                   })
                }
            })(me, record);
        }
    },
    components: VUEApp.loadComponents({
        LOAD    : {
            'selectBranch'   : '/vueApp/easydocker/selectBranch.vue',
            'dockerAdupter'  : '/vueApp/easydocker/dockerAdupter.vue',
            'iframeObj'      : '/vueApp/easydocker/_iframe.vue'
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