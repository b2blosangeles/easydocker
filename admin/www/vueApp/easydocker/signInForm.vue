<template>
    <div class="card shadow m-2 mr-1">
        Sign In Form
        <a class="btn btn-sm btn-success m-1 pull-right" href="JavaScript:void(0)" v-on:click="signin()">
                signin
        </a>
    </div>
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            root :  this.$parent.root,
            errors: {},
            publicDockers     : [],
            branches : null,
            form : {
                serverName  : '',
                gitHub      : '',
                branch      : '',
                siteDocker  : false,
                publicDocker: '',
                docker: {
                    type : '',
                    ports : [],
                    dockerFile : ''
                },
            }
        }
    },
    mounted() {
        var me = this;
    },
    methods : {
        initForm() {
            var me = this;

        },
        cleanForm() {
            var me = this;

        },
        signin() {
            var me = this;
            localStorage.setItem('easydockerFP', new Date().toString());
            let v = localStorage.getItem('easydockerFP');
            me.root.token = v;
        },
    }
}
</script>
 
<style>
.noFormImage {
    min-width: 100%;
    min-height :512px;
    background-image: url("/imgs/icon1.png");
    background-color: transparent;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
}
.dropdown-pick-docker {
    height:20em;
    z-index: 3000;
    width: 800px !important; 
    overflow-y: scroll;
    overflow-x: hidden;
}

.bg-odd {  min-height : 6em; border-bottom: 1px dashed; border-color: #aaa;}
.bg-even {  min-height : 6em;  border-bottom: 1px dashed; border-color: #aaa; }
.border-width-1 {  border-width: 6px; border-color: #999}

input.dockerfile[readonly] {
  background-color:transparent;
}

</style>
