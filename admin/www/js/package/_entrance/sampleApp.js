$(document).ready(
    function() {
        var vueRootCommon = (typeof VUEApp.rootData === 'undefined')? {} : VUEApp.rootData;
        VUEApp.registeRootData('solution','');

        var router = new VueRouter({
            mode: 'history',
            routes: []
        });

        new Vue({
            el: '#vAppMaster',
            data: function() {
                return {
                    owner : 'shusiou.win'
                }
            },
            created() {

            },
            mounted () {
 //               VueApp.dynamic({'copyright' : '/vueApp/vueComm/copyright.vue'}, this);
 //               this.$forceUpdate();
            },
            methods : {
            },
            components: VUEApp.loadComponents({
                PARKING : {

                },
                TPL     : {
                //    'copyright' : '/vueApp/vueComm/copyright.vue'
                }
            })
        });
        /*   
        new Vue({
            el: '#vAppMaster',
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
                    triggerSpinner : false,
                    module : 'list',
                    vueRootCommon : (typeof vueRootCommon === 'undefined')? {} : vueRootCommon
                }
            },
            methods :{
                dataEngine() {
                    return this.$refs.dataEngine
                }
            },
            components: VueApp.components({
                LOAD :{
                    'appMaster' : {
                        'popUpModal': 'popUpModal.vue',
                        'dataEngine': 'dataEngine.vue',
                        'spinner'   : 'spinner.vue',
                        'header' : 'appHeader.vue',
                        'form'   : 'vForm.vue'
                    }
                }
            })
        });
        */
        new Vue({
            el: '#vAppService',
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
                    triggerSpinner : false,
                    module : 'list',
                    vueRootCommon :  vueRootCommon,
                    owner : 'shusiou.win'
                }
            },
            mounted () {
                VUEApp.dynamicLoadComponent({'copyright' : '/vueApp/vueComm/copyright.vue'}, this);
                this.$forceUpdate();
            },
            methods :{
                dataEngine() {
                    return this.$refs.dataEngine
                }
            },
            components: VUEApp.loadComponents({
                    LOAD    : {
                    }, 
                    TPL     :{
                        'popUpModal': '/vueApp/appService/popUpModal.vue',
                        'appHeader' : '/vueApp/appService/appHeader.vue',
                        'dataEngine': '/vueApp/appService/dataEngine.vue',
                        'spinner'   : '/vueApp/appService/spinner.vue',
                        'appForm'   : '/vueApp/appService/vForm.vue',
                        'fileUpload': '/vueApp/vueComm/fileUpload/fileUpload.vue'
                    }
            })
        });

        new Vue({
            router,
            el: '#vDebugMessage',
            data: function() {
                return {
                    vueRootCommon : vueRootCommon
                }
            },
            mounted () {
                VUEApp.registeRootData('debugModel',(this.$route.query.debug !== 'true') ? false :  true);
            },
            methods :{},
            components: VUEApp.loadComponents({
                LOAD    : {
                    'appDebug'  : '/vueApp/vueComm/vueDebug.vue'
                }
            })
        });
    }
) 
