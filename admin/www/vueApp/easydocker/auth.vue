<template>
    <div v-if="isAuthExist === false" class="authPage">
         <div class="overlay_auth_cover"></div>
        Auth
    </div>
</template>
 
<script>
module.exports = {
   props: [],
   data: function() {
      return {
         root :  this.$parent.root,
         isAuthExist  : null
      }
   },
   mounted() {
      var me = this;
      me.isAuthExist = me.checkAuthExist();
   },
   methods : {
      checkAuthExist() {
         var me = this;
         me.root.dataEngine().post({cmd: 'auth', data : {code : 'isAuthReady' }}, function(result) {
               if (result.status === 'success') {
                  me.isAuthExist = true;
                 // result.isAuthReady;
               }
         });   
      }
   }
}
</script>
<style>
/*---- overlay and spinner ---*/
.overlay_auth_cover {
    position:fixed;
    top:0; left:0;
    background:rgba(255,255,255,1);
    z-index:8000;
    width:100%;
    height:100%;
    /* display:none; */
}

</style>