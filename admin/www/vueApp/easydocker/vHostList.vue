<template>
    <div class="card shadow m-2 ml-1">
        <div class="card-body card-list-section">

            <div class="list-group " id="list_section" v-for="item in  $parent.commonData.list">
                <div class="list-group-item list-group-item-action flex-column align-items-start mb-0">

                    <div class="container-fluid m-0">
                        <div class="row">
                            <div class="col-3 p-0 m-0 text-left">
                                <h3><b>{{item.name}}</b></h3>
                            </div>
                            <div class="col-9 p-0 m-0 text-left">
                                Server name: <span class="text-info">{{item.name}}</span>
                                <span class="ml-3">
                                    Port : <span class="text-info"> {{outerPorts(item)}} </span>
                                </span>
                                <!--span>
                                <br/>
                                Docker file: <span class="text-info">{{item.dockerFile}}</span><br/>
                                github : <span class="text-info"> {{item.gitHub}}</span><br/>
                                branch : <span class="text-info"> {{item.branch}}</span>
                                </span-->
                                <br/>
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
            list : []
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
        getVHostList() {
            var me = this;
            me.$parent.dataEngine().getVHostList();
        },
        deleteVirtualServer(serverName) {
            var me = this;
            me.$parent.commonData.popUp.serverName = serverName;
            $('#confirm_modal').modal('show');
        },
        stopVHost(serverName) {
            var me = this;
            me.$parent.dataEngine().stopVHost(serverName);
        },
        pullCode(serverName) {
            var me = this;
            me.$parent.dataEngine().pullCode(serverName);
        },       
        resetVHost(serverName) {
            var me = this;
            me.$parent.dataEngine().resetVHost(serverName);
        },
        outerPorts(item) {
            var me = this;
            var str = '';
            var p = item.ports;
            for (var i = 0; i < p.length; i++) {
                str += p[i].i + '-' + p[i].o
            }
            return str.replace(/\,$/,'');
        }
    }

}
</script>
 
<style>
</style>