<template>
</template>

<script>
module.exports = {
    props: ['commonData'],
    data: function() {
        return {
        }
    },
    created() {
        var me = this;
    },
    methods :{
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
                    console.log(result);
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
        removeVirtualHost(serverName) {
            var me = this;
            $('#confirm_modal').modal('hide');
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
                            me.$parent.commonData.list = result.list;
                    }
                },
                dataType: 'JSON'
            });
        },
        getVHostList(noSpinner, callback) {
            var me = this;
            if (!noSpinner) {
                me.$parent.triggerSpinner = true;
            }
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'loadList'
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (callback) callback(result.list);
                    me.$parent.commonData.list = result.list;
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    me.$parent.triggerSpinner = false;
                },
                dataType: 'JSON'
            });
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
            /*
            setTimeout(
                () => {
                    alert(889);
                     me.$parent.triggerSpinner = false;
                }, 1000
            );
            return true;
            */
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
