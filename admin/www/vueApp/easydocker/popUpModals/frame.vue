<template>
    <div id="confirm_modal_frame" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <p>test host "{{this.$parent.commonData.popUp.serverName}}"</p>
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
        }
   },
   methods :{
   }
}
</script>
 
<style>
</style>