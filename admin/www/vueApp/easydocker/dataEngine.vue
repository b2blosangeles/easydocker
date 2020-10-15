<template>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            caller : null
        }
    },
    created() {
        var me = this;
    },
    methods :{
        withAuth(data) {
            let v = localStorage.getItem('easydockerFP');
            if (v) {
                data.authToken = v;
            }
            return data;
        },
        ajaxPost(data, callback, isSpinner) {
            var me = this;
            if (isSpinner) me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: me.withAuth(data),
                success: function(result) {
                    if (isSpinner) me.$parent.triggerSpinner = false;
                    callback(result)
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    if (isSpinner) me.$parent.triggerSpinner = false;
                    callback(result);
                },
                dataType: 'JSON'
            });
        },
       restartProxy() {
            var me = this;
            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'restartProxy'
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        runPost(url, cmd, params, success, error) {
            var me = this;
            me.$parent.triggerSpinner = true;

            let data = {params : params, cmd: cmd};
  
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (typeof  success === 'function') {
                        success({status : 'success', result : result});
                    }
                },
                error: function (jqXHR) { 
                    me.$parent.triggerSpinner = false;
                    if (typeof error === 'function') {
                        error({statu : 'failure', message : 'failure request.', result : jqXHR.responseText});
                    }
                },
                dataType: 'JSON'
            });
        },
        removeAllHosts() {
            var me = this;
            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'removeAllHosts'
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        resetVHost(serverName) {
            var me = this;

            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'resetVHost',
                    serverName : serverName
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    console.log(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        switchBranch(serverName, branch, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'gitSwitchBranch',
                    serverName : serverName,
                    branch     : branch
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (callback) callback(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                    if (callback) callback(result);
                },
                dataType: 'JSON'
            });
        },
        stopVHost(serverName) {
            var me = this;

            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'stopVHost',
                    serverName : serverName
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    console.log(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        pullCode(serverName) {
            var me = this;

            me.$parent.triggerSpinner = true;

            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'pullCode',
                    serverName : serverName
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    console.log(result);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        removeVirtualHost(serverName, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'deleteHost',
                    serverName :serverName
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (result.status === 'success') {
                        callback(result);
                    }
                },
                dataType: 'JSON'
            });
        },
        getDbMysqlList(noSpinner, callback) {
            var me = this;
            me.ajaxPost({
                    cmd :'getDbMysqlList'
                }, callback, !noSpinner);
        },
        getVHostList(noSpinner, callback) {
            this.ajaxPost({
                cmd :'loadList'
            }, callback, !noSpinner);
        },
        loadPublicDockersList(noSpinner, callback) {
            var me = this;
            if (!noSpinner) {
                me.$parent.triggerSpinner = true;
            }
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'loadPublicDockersList'
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (callback) callback(result.list);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        },
        gitSiteBranchs(serverName, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'gitSiteBranchs',
                    serverName : serverName
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    callback(result);
                },
                dataType: 'JSON'
            });
        },

        gitRemoteBranchs (gitRecord, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'gitRemoteBranchs',
                    data : gitRecord
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    callback(result);
                },
                dataType: 'JSON'
            });
        },
        saveVHostForm(data, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'addHost',
                    data: data
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (result.status === 'success') {
                        // me.getVHostList();
                    }
                    callback(result); 
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
        }
    }
}
</script>
 
<style>
</style>
