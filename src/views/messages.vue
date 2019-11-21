<template>
    <div id="app">
        <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
        <v-app id="inspire">
            <v-container grid-list-md style="margin:0px">
                <v-layout row wrap>
                    <v-flex xs12 >
                        <nav_header ref="header"></nav_header>
                    </v-flex>
                    <v-flex xs12 style="height: 30px">
                        <nav_breadcrumb v-bind:breadcrumbItems="breadcrumbItems"></nav_breadcrumb>
                    </v-flex>
                    <v-flex xs12>
                        <v-content style="padding: 0px; padding-bottom: 20px; align-self: center">
                            <v-container >
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-card>
                                            <v-toolbar flat >
                                                <p>Invitations:</p>
                                            </v-toolbar>
                                            <v-divider></v-divider>
                                            <p v-show="invitations.length+team_invitations===0">No invitations</p>
                                            <v-list  two-line style="padding: 0px;" >
                                                <v-list-item v-for="(item, index) in invitations">
                                                    <v-layout align-center justify-center row fill-height >
                                                        <v-flex xs2 >
                                                            <div style="padding-left:10px">
                                                                <v-avatar color="indigo" size="26">
                                                                    <span class="white--text headline">{{item[0]}}</span>
                                                                </v-avatar>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs2>
                                                            <a>{{item}}</a>
                                                        </v-flex>
                                                        <v-flex xs4>
                                                            <div> wants to play with you!</div>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-btn
                                                                    color="red"
                                                                    @click="deny(index)"
                                                            >
                                                                Deny
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-btn
                                                                    color="success"
                                                                    @click="accept(index)"
                                                            >
                                                                Accept
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs12>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-list-item>
                                                <v-list-item v-for="(item, index) in team_invitations">
                                                    <v-layout align-center justify-center row fill-height >
                                                        <v-flex xs2 >
                                                            <div style="padding-left:10px">
                                                                <v-avatar color="indigo" size="26">
                                                                    <span class="white--text headline">{{item[0]}}</span>
                                                                </v-avatar>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex xs2>
                                                            <a>{{item["invitor"]}}</a>
                                                        </v-flex>
                                                        <v-flex xs4>
                                                            <div> invites you to join <b>{{item["teamname"]}}</b> </div>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-btn
                                                                    color="red"
                                                                    @click="deny_team_invitation(index)"
                                                            >
                                                                Deny
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-btn
                                                                    color="success"
                                                                    @click="accept_team_invitation(index)"
                                                            >
                                                                Accept
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs12>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-list-item>
                                                <v-divider></v-divider>
                                            </v-list>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-content></v-flex>

                    <v-flex xs12>
                        <nav_footer></nav_footer>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-app>
    </div>
</template>

<script>
    import nav_header from "../components/new_header"
    import nav_footer from "../components/new_footer"
    import Cookies from 'js-cookie'
    import nav_breadcrumb from "../components/new_breadcrumb"
    import axios from 'axios'
    import {data} from "../js/data"


    export default {
        name: "messages",
        data(){
            return {
                breadcrumbItems:[{
                    text:"Home",
                    disable:true,
                    href:"main_page"
                }],
                username:"",
                invitations:[],
                team_invitations:[],
                is_small:false,
                times: data["times"],
                games: data["games"],
            }

        },
        components:{
            nav_header,
            nav_footer,
            nav_breadcrumb
        },
        mounted: function () {
            this.username = this.$route.params.username;
            if(!this.username){
                this.username = Cookies.get("username");
            }
            this.get_invitations();

        },
        methods:{
            get_invitations() {
                axios.get("/api/show_invitation_list", {
                    params: {
                        username: this.username
                    }
                }).then((res)=>{
                    this.invitations=res.data.result.invitations;
                    this.team_invitations=res.data.result.team_invitations;
                }, (err)=>{
                    alert(err)
                })
            },
            accept(index){
                axios.post("/api/accept_invitation",{
                    username: this.username,
                    player:this.invitations[index]
                }).then((res)=>{
                    alert("successfully add friend.");
                    this.invitations.splice(index, 1);
                    this.$refs.header.change_message_num(-1);
                }, (err)=>{
                    alert(err)
                })

            },
            deny(index){
                axios.post("/api/deny_invitation",{
                    username: this.username,
                    player:this.invitations[index]
                }).then((res)=>{
                    this.invitations.splice(index, 1);
                    this.$refs.header.change_message_num(-1);

                }, (err)=>{
                    alert(err)
                })
            },
            accept_team_invitation(index){
                axios.post("/api/accept_team_invitation",{
                    username: this.username,
                    teamid:this.team_invitations[index]["teamid"],
                    teamname:this.team_invitations[index]["teamname"],
                    invitor:this.team_invitations[index]["invitor"]
                }).then((res)=>{
                    alert("successfully join the team.");
                    this.team_invitations.splice(index, 1);
                    this.$refs.header.change_message_num(-1);
                }, (err)=>{
                    alert(err)
                })
            },
            deny_team_invitation(index){
                axios.post("/api/deny_team_invitation",{
                    username: this.username,
                    teamid:this.team_invitations[index]["teamid"],
                    invitor:this.team_invitations[index]["invitor"]
                }).then((res)=>{
                    this.team_invitations.splice(index, 1);
                    this.$refs.header.change_message_num(-1);
                }, (err)=>{
                    alert(err)
                })
            }
        }

    }
</script>

<style scoped>

</style>