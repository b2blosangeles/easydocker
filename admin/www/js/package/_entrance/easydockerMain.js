$(document).ready(
    function() {
        $(document).ready(
            function() {
                
                new Vue({
                    el: '#vHostApp',
                    data: function() {
                        return {
                            root : this,
                            token : null,
                            isAuth  : false,
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
                    mounted () {
                        var me = this;
                        setTimeout(
                            function() {
                                me.dataEngine().auth();
                            }, 50
                        );
                    },
                    methods :{
                        dataEngine() {
                            return this.$refs.dataEngine
                        },
                        appBody() {
                            return this.$refs.appBody
                        },
                        popUp() {
                            return this.$refs.popUpModal
                        }
                    },
                    components: VUEApp.loadComponents({
                        LOAD    : {}, 
                        TPL :{
                            'appBody' : '/vueApp/easydocker/appBody.vue',
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
