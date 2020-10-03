$(document).ready(
    function() {
        $(document).ready(
            function() {
                
                new Vue({
                    el: '#vHostApp',
                    data: function() {
                        return {
                            root : this,
                            commonData :{
                                list : [],
                                dockers : [],
                                popUp : {
                                    serverName  : '',
                                    insideModule: ''
                                },
                                formStarted : false
                            },
                            triggerSpinner : false,
                            module : 'list'
                        }
                    },
                    methods :{
                        dataEngine() {
                            return this.$refs.dataEngine
                        },
                        dataEngine() {
                            return this.$refs.dataEngine
                        },
                        vHostList() {
                            return this.$refs.vHostList
                        },
                        popUp() {
                            return this.$refs.popUpModal
                        }
                    },
                    components: VUEApp.loadComponents({
                        LOAD    : {
                        }, 
                        TPL :{
                            'vHostList' : '/vueApp/easydocker/vHostList.vue',
                            'vHostForm' : '/vueApp/easydocker/vHostForm.vue',
                            'popUpModal': '/vueApp/easydocker/popUpModals/_frame.vue',
                            'dataEngine': '/vueApp/easydocker/dataEngine.vue',
                            'spinner'   : '/vueApp/easydocker/spinner.vue',
                            'appHeader' : '/vueApp/easydocker/appHeader.vue'
                        }
                    })
                });
            }
        ) 
        
    }
) 
