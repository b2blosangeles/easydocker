<template>
    <div v-if="!isAuth" class="authPage">
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
         isAuth  : false
      }
   },
   mounted() {
      var me = this;
      setTimeout(
         function() {
            me.isAuth = me.checkAuth();
         }, 3000
      );
   },
   methods : {
      checkAuth() {
         return true;
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