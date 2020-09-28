<template>
    <div id="confirm_modal_frame" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <p>test host "{{this.$parent.commonData.popUp.serverName}}"</p>
                    <span v-bind:is="loadModule()"></span>
                    <button type="button" class="btn btn-secondary m-1" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
           // insideModule : ''
        }
    },
    mounted() {
        var me = this;
        setTimeout(
            function() {
                // me.$forceUpdate();
            }, 2000
        );
    },
   methods :{
       loadModule() {
           var me = this;
           return (me.$parent.commonData.popUp.insideModule === 'switchBranch') ? 'switchBranch' : 'confirmDelete';
       }
   },
   components: VUEApp.loadComponents({
        LOAD    : {
            'switchBranch' : '/vueApp/easydocker/popUpModals/switchBranch.vue',
            'confirmDelete' : '/vueApp/easydocker/popUpModals/confirmDelete.vue'
        }, 
        TPL :{
            
        }
    })
}
</script>
 
<style>
</style>