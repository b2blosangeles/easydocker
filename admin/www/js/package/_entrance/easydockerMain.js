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
                    mounted () {
                        localStorage.setItem('easydockerFP', new Date().toString());
                        let v = localStorage.getItem('easydockerFP')
                        console.log(v)
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
