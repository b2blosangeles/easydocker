<template>
   <span>
      <div v-if="isAuthExist === false" class="overlay_auth_frame center-block">
         <div class="overlay_auth_cover"></div>
         <div class="card shadow m-3 p-3 overlay_auth_body" v-if="isAuthExist === false">
            <div class="form-group">
                  <label><h3>Initial Authentication Setup aaa</h3> (Setup Admin Password)</label>
            </div>
            <div class="form-group">
                  <div class="row p-1">
                     <div class="col-1"></div>
                     <div class="col-10 text-left">
                           <label class="pl-2"><b>Admin Password</b></label>
                           <input type="password" class="form-control" v-model="formInit.password" placeholder="Admin password">                        
                     </div>
                     <div class="col-1"></div>
                  </div>    
                  <div class="row p-1">
                     <div class="col-1"></div>
                     <div class="col-10 text-left">
                           <label class="pl-2"><b>Verify Password</b></label>
                           <input type="password" class="form-control" v-model="formInit.vpass" placeholder="verify password">
                     </div>
                     <div class="col-1"></div>
                  </div>  
                  <div class="row p-1">
                     <div class="col-1"></div>
                     <div class="col-10 text-left">
                           <button type="button" v-bind:disabled="!isInitValid()" class="btn btn-info m-3" v-on:click="initAdminPassword()">Setup</button>
                     </div>
                     <div class="col-1"></div>
                  </div>  
            </div> 
            
         </div>
      </div>
      <div v-if="isAuthExist === true && !isLogin()" class="overlay_auth_frame center-block">
         <div class="overlay_auth_cover"></div>
         <div class="card shadow m-3 p-3 overlay_auth_body">
            <div class="form-group">
                  <label><h3>Sign in</h3></label>
            </div>
            <div class="form-group">
                  <div class="row p-1">
                     <div class="col-1"></div>
                     <div class="col-10 text-left">
                           <label class="pl-2"><b>Admin Password</b></label>
                           <input type="password" class="form-control" placeholder="Admin password">                        
                     </div>
                     <div class="col-1"></div>
                  </div>
                  <div class="row p-1">
                     <div class="col-1"></div>
                     <div class="col-10 text-left">
                           <button type="button" class="btn btn-info m-3" v-on:click="signin()">Sign in</button>
                     </div>
                     <div class="col-1"></div>
                  </div>  
            </div> 
            
         </div>
      </div>
   </span>
</template>
 
<script>
module.exports = {
   props: [],
   data: function() {
      return {
         root :  this.$parent.root,
         isAuthExist  : null,
         isLogedin : true,
         formInit : {
            password: '',
            vpass:''
         }
      }
   },
   mounted() {
      var me = this;
      me.isAuthExist = me.checkAuthExist();
   },
   methods : {
      isLogin() {
         return (this.isLogedin) ? true : false
      },
      checkAuthExist() {
         var me = this;
         me.root.dataEngine().post({cmd: 'auth', data : {code : 'isAuthReady' }}, function(result) {
               if (result.status === 'success') {
                  me.isAuthExist = result.isAuthReady;
               }
         });   
      },
      isInitValid() {
         var me = this;
         return (!me.formInit.password || me.formInit.password !== me.formInit.vpass) ? false : true;
      },
      initAdminPassword() {
         var me = this;
         me.root.dataEngine().post({cmd: 'auth', data : {code : 'initPassword', password: me.formInit.password }}, function(result) {
               if (result.status === 'success') {
                  me.isAuthExist = true;
                  console.log(result);
               } else {
                  me.isAuthExist = true;
               }
               me.isLogedin = true;
               console.log(me.isAuthExist);
         });
      },
      signIn() {
         alert('signIn');
      }
   }
}
</script>
<style>
/*---- overlay and spinner ---*/
.overlay_auth_frame {
   position:fixed;
   width   : 100%;
   height  : 100%;
   top:0; left:0;
   min-height : 18em;
}
.overlay_auth_cover {
    position:fixed;
    top:0; left:0;
    background:rgba(255,255,255,1);
    z-index:8001;
    width:100%;
    height:100%;
    /* display:none; */
}
.overlay_auth_body {
   position:relative;
   width    : 80%;
   z-index:8009;
   left:10%;
   right:10%;
   min-height : 18em;
}

</style>