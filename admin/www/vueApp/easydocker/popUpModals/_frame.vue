<template>
    <div id="confirm_modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <span v-bind:is="loadModule()"></span>
                    <button type="button" class="btn btn-secondary m-1" data-dismiss="modal" v-on:click="close()">Cancel</button>
                    
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
            caller : null,
            cfg : {},
            root :  this.$parent.root
        }
    },
    mounted() {
        var me = this;
    },
   methods :{
        show(param, caller) {
            var me = this;
            me.cfg = param;
            $('#confirm_modal').modal('show');
            me.caller = caller;
        },
        loadModule() {
           let me = this;
           let list = ['switchBranch', 'confirmDelete'];
           return (list.indexOf(me.cfg.insideModule)  === -1) ? '' : me.cfg.insideModule;
        },
        close() {
            var me = this;
            me.cfg = {};
            me.caller = null;
            $('#confirm_modal').modal('hide');
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