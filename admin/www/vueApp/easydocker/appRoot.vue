<template>
    <div class="container-fluid m-0 mt-2" >
        <div class="row">
            <div class="col-1 p-0"></div>
            <div class="col-10 pt-6 text-center">
                <app-header></app-header>
                <app-body ref="appBody"></app-body>
                <auth ref="auth"></auth>
            </div>
            <div class="col-1 p-0"></div>
        </div>
        <data-engine ref="dataEngine"></data-engine>
        <pop-up-modal ref="popUpModal"></pop-up-modal>
        <spinner></spinner>     
    </div>
</template>
 
<script>
module.exports = {
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
            module : 'list',
            menu   : ''
        }
    },
    mounted () {
        document._iFrameBridge = (!document._iFrameBridge) ? {} : document._iFrameBridge;
    },
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
        LOAD    : {
        }, 
        TPL :{
            'auth'      : '/vueApp/easydocker/auth.vue',
            'appBody'   : '/vueApp/easydocker/appBody.vue',
            'popUpModal': '/vueApp/easydocker/popUpModals/_frame.vue',
            'dataEngine': '/vueApp/easydocker/dataEngine.vue',
            'spinner'   : '/vueApp/easydocker/spinner.vue',
            'appHeader' : '/vueApp/easydocker/appHeader.vue'
        }
    })
}
</script>
 
<style>

</style>
