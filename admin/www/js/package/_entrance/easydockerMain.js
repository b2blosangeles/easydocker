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
                            module : 'webservers',
                            menu   : ''
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
                        dataEngine(caller) {
                            if (caller) this.$refs.dataEngine.caller = caller;
                            return this.$refs.dataEngine
                        },
                        getAuth() {
                            return this.$refs.auth
                        },
                        appBody() {
                            return this.$refs.appBody
                        },
                        popUp(caller) {
                            if (caller) this.$refs.popUpModal.caller = caller;
                            return this.$refs.popUpModal
                        },
                        matrix(v) {
                            var me = this;
                            return (me.module === v) ? true : false;
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
