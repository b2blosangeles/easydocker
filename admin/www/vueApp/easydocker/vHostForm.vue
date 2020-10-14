<template>
<div class="card shadow m-2 mr-1">
    <div class="card-body card-form-section text-left">
        <form>
            <div class="form-group">
                <label>Repository git URI *</label>
                <input type="text" class="form-control" v-model="form.gitHub" @input="changedGit" placeholder="Repository git URI">
            </div>
            <div class="form-group" v-if="branches===null">
                <div class="container-fluid border border-2 p-2 alert-secondary rounded">
                    <div class="row">
                        <div class="col-6">
                            <label>Repository username</label>
                            <input type="text" class="form-control" v-model="form.userName"  placeholder="Rep. username">                        
                        </div>
                        <div class="col-6">
                            <label>Repository password</label>
                            <input type="password" class="form-control" v-model="form.password" placeholder="Rep. password">
                        </div>
                    </div>    
                </div>
            </div>
            <button type="button" v-if="branches===null" class="btn btn-info" v-on:click="gitRemoteBranchs(form)">Get branchs</button>
            <div v-if="branches!==null" >
                <input type="hidden" v-model="form.userName">
                <input type="hidden"  v-model="form.password" >
            </div>

            <div class="form-group" v-if="branches!==null" >
                <label>Host ServerName * </label>
                <input type="text" class="form-control" maxlength="64" v-model="form.serverName" placeholder="Host ServerName">
            </div>


            <div class="form-group" v-if="branches!==null" >
                <label>Branche</label>
                <select class="form-control" :required="true" @change="onBranchSelect($event)" v-model="form.branch">
                    <option 
                    v-for="option in branches" 
                    v-bind:value="option.branch"
                    :selected="option.branch ==  form.branch"
                    >{{ option.branch }}</option>
                </select>
            </div>
            <div v-if="form.docker.dockerFile">
                 <hr/>
                ports: {{ form.docker.ports }}   Docker file: {{form.docker.dockerFile}}  Type: {{form.docker.type}}
                 <hr/>
            </div>
            <div class="form-group" v-if=" branches !== null && !form.siteDocker">
                <label>Dockerfile</label>
                    <div class="dropdown">
                        <input type="text" data-toggle="dropdown"  class="form-control dockerfile" v-model="form.publicDocker" 
                        aria-haspopup="true" aria-expanded="false"
                        placeholder="Select your Dockerfile" readonly />
                        
                        <div class="dropdown-menu dropdown-pick-docker shadow border-secondary rounded-0 border-width-1" >
                            <div v-for="(v, k) in publicDockers" class="dropdown-item" v-bind:class="{ 'bg-even': !(k%2), 'bg-odd': (k%2) }">
                                <a href="JavaScript:void(0)" v-on:click="selectPublicDocker(v)"><b>{{v.code}}</a></a>
                                <p class="text-wrap p-0 m-1" v-html="v.description"></p>
                            </div>
                        </div>
                    </div>
            </div>
            <hr/>
            <button type="button" v-if="branches!==null" class="btn btn-info" v-on:click="saveVHost()">Save the virtual host</button>
            <!--button type="button" class="btn btn-warning" v-on:click="reset()">Reset fields</button-->
            <button type="button" class="btn btn-secondary" v-on:click="cancel()">Cancel</button>
            
            <hr/>
            <div class="text-danger p-3"  v-if="!isformValid()">
                <b>Please correct the following error(s):</b>
                <ul>
                <li v-for="(v, k) in errors">{{v}}</li>
                </ul>
            </div>
        </form>
    </div>
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
        setTimeout(
            function() {
                me.loadPublicDockersList()
            }, 1000
        );
    },
    methods : {
        initForm() {
            var me = this;
            me.branches = null;
            me.form = {
                serverName  : '',
                gitHub      : '',
                branch      : '',
                siteDocker  : false,
                publicDocker: '',
                docker: {
                        type : '',
                        ports : [],
                        dockerFile : ''
                }
            };

        },
        cleanForm() {
            var me = this;
            me.branches = null;
            me.form.serverName = '';
            me.form.branch = '';
            me.form.siteDocker  = false;
            me.form.publicDocker = '';
            me.form.docker = {
                    type : '',
                    ports : [],
                    dockerFile : ''
                };

        },
        changedGit(e) {
            var me = this;
            me.cleanForm();
        },
        loadPublicDockersList() {
            var me = this;
            me.root.dataEngine().loadPublicDockersList(true, function(data) {
                me.publicDockers = data;
            });
        },
        gitRemoteBranchs(gitRecord) {
            var me = this;
            me.gitValidation();
            me.$forceUpdate();
            if (me.isformValid()) {
                me.root.dataEngine().gitRemoteBranchs(gitRecord, function(result) {
                    if (result.status === 'success') {
                        me.branches = result.list;
                    } else {
                        me.branches = [];
                        me.errors.gitHub = result.message;
                    }
                    me.getInitBranch();
                    me.getSiteDocker();
                    me.$forceUpdate();
                });
            }
        },
        getInitBranch() {
            var me = this;
            for (var i = 0; i < me.branches.length; i++) {
                if (me.form.branch === me.branches[i].branch) {
                    return true;
                }
            }
            me.form.branch = (me.branches.length) ? me.branches[0].branch : '';
        },
        onBranchSelect(event) {
            var me = this;
            me.form.branch = event.target.value;
            me.getSiteDocker();
        },

        getSiteDocker() {
            var me = this;
            if (me.branches) {
                for (var i = 0; i < me.branches.length; i++) {
                    if (me.form.branch === me.branches[i].branch && me.branches[i].dockerSetting.dockerFile) {
                        me.form.siteDocker = true;
                        me.form.docker = me.branches[i].dockerSetting;
                        me.$forceUpdate();
                    }
                }
            }
        },

        selectPublicDocker(v) {
            var me = this;
            me.form.publicDocker = v.code;
            me.form.siteDocker = false;
            me.form.docker = v.setting;
            me.$forceUpdate();
        },
        saveVHost() {
            var me = this;
            me.formValidation();
            if (!me.isformValid()) {
                return false;
            } 
            me.root.dataEngine().saveVHostForm(
                me.form, function(result) {
                    if (result.status === 'success') {
                        me.cancel();
                        me.$parent.getVHostList()
                    }
                }
            );
        },

        reset() {
            var me = this;
            me.form = {};
            me.errors={};
            me.branches = [];
        },
        cancel() {
            var me = this;
            me.reset();
            me.$parent.module = '';
        },
        isformValid() {
            var me = this;
            return (!Object.keys(me.errors).length) ? true : false;
        },
        isServerNameExist(name) {
            var me = this, list = me.root.commonData.list
            for (e in list) {
                console.log(e);
                if (list[e].serverName == name) {
                    return true;
                }
            }
            return false;
        }, 
        gitValidation() {
            var me = this;
            me.errors.gitHub = null;
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            
            if (!me.form.gitHub) {
                me.errors.gitHub = 'Github URI required.';
            } else if (!regex.test(me.form.gitHub)) {
                me.errors.gitHub = 'Incorrect github URI.';
            } else {
                delete me.errors.gitHub;
            }
            return (!me.errors.gitHub) ? true : false;
        },
        formValidation() {
            var me = this;
            me.errors = {};
            me.gitValidation();

            if (!me.form.serverName) {
                me.errors.serverName = 'ServerName required.';
            }

            if (me.isServerNameExist(me.form.serverName)) {
                me.errors.serverName = 'ServerName required.';
            }

            if (!me.form.docker.dockerFile) {
                me.errors.dockerFile = 'DockerFile required.';
            }
            
        }
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
