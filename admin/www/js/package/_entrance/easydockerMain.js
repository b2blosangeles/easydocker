$(document).ready(
    function() {
        $(document).ready(
            function() {
                
                new Vue({
                    el: '#vHostApp',
                    data: function() {
                        return {
                            root : this,
                            auth : {},
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
                    mounted () {},
                    methods :{
                        isSignin() {
                            return (!this.root.auth || !this.root.auth.isSignIn || !this.root.auth.isAuthExist) ? false : true
                        },
                        signOff() {
                            this.getAuth().signOff();
                        },
                        dataEngine() {
                            return this.$refs.dataEngine
                        },
                        getAuth() {
                            return this.$refs.auth
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
                            'auth'      : '/vueApp/easydocker/auth.vue',
                            'appBody'   : '/vueApp/easydocker/appBody.vue',
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
