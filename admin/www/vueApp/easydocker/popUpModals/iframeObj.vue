<template>
    <span class="text-left">
       <iframe v-bind:src="$parent.cfg.data.url" style="min-height:30em;width:100%; border: 0"></iframe>
    </span>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
            parent : this.$parent,
        }
    },
    mounted() {
    },
    destroyed() {
       document._vueBridge = function(v) {}
    },
    methods :{
        
    }
}
</script>
 
<style>
</style>