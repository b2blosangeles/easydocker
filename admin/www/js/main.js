var uiAdmin = {};
uiAdmin.execDelet = function(serverName) {
    var me = this;
    $.ajax({
        type: 'POST',
        url:'/api',
        data: {
            cmd :'deleteHost',
            serverName :serverName
        },
        success: function(result) {
            if (result.status !== 'success') {
                uiAdmin.showErrorMessage(result.message);
            } else {
                me.refreshList(result.list);
                uiAdmin.showErrorMessage('');
            }
            $('#confirm_modal').html('');
            $('#confirm_modal').modal('hide');
        },
        dataType: 'JSON'
    });
};

uiAdmin.formData = function() {
    var object = {};
    var formData = $('form').serializeArray();
    for (o in formData) {
        object[formData[o].name] = formData[o].value;
    };
    return (!object['serverName'] || !object['gitHub']) ? false : object;
}
uiAdmin.resetForm = function() {
    $('form').trigger("reset");
    this.showErrorMessage('');
}
uiAdmin.addHost = function() {
    var me = this;
    var data = uiAdmin.formData();
    if (!data) {
        me.showErrorMessage('Wong form data!');
    } else {
        $.ajax({
            type: 'POST',
            url:'/api',
            data: {
                cmd :'addHost',
                data: uiAdmin.formData()
            },
            success: function(result) {
                if (result.status !== 'success') {
                    uiAdmin.showErrorMessage(result.message);
                } else {
                    me.resetForm();
                } 
            },
            dataType: 'JSON'
        });
    }
};
uiAdmin.loadList = function() {
    var me = this;
    $.ajax({
        type: 'POST',
        url:'/api',
        data: {
            cmd :'loadList'
        },
        success: function(result) {
            me.refreshList(result.list);
        },
        dataType: 'JSON'
    });
}

uiAdmin.showErrorMessage = function(str) {
    $('#error_section').html(str)
}
$(document).ready(
    function() {
        
        new Vue({
            el: '#vHostApp',
            data: function() {
                return {
                    commonData :{
                        list : [],
                        dockers : [],
                        popUp : {
                            serverName : ''
                        },
                        formStarted : false
                    },
                    triggerSpinner : false
                }
            },
            methods :{
                dataEngine() {
                    return this.$refs.dataEngine
                }
            },
            components: {
                'vHostList' : httpVueLoader('/vueApp/easydocker/vHostList.vue'),
                'vHostForm' : httpVueLoader('/vueApp/easydocker/vHostForm.vue'),
                'popUpModal': httpVueLoader('/vueApp/easydocker/popUpModal.vue'),
                'dataEngine': httpVueLoader('/vueApp/easydocker/dataEngine.vue'),
                'spinner'   : httpVueLoader('/vueApp/easydocker/spinner.vue'),
                'appHeader' : httpVueLoader('/vueApp/easydocker/appHeader.vue')
            }
        });
    }
) 
