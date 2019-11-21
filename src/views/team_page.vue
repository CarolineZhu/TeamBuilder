<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div id="app">
        <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
        <v-app id="inspire">
            <v-container style="padding: 0px; margin: 0px; border: 0px" grid-list-md >
                <v-layout align-start justify-start row wrap>
                    <v-flex xs12>
                        <nav_header ref="header">
                        </nav_header>
                    </v-flex>
                    <v-content style="padding: 0px">
                        <v-container fluid grid-list-xl style="margin: 0px; padding: 0px">
                            <v-layout  row wrap>
                                <v-flex xs12 style="height: 0px; padding-left:40px">
                                    <nav_breadcrumb v-bind:breadcrumbItems="breadcrumbItems">
                                    </nav_breadcrumb>
                                </v-flex>
                                <v-flex xs4 class="hidden-sm-and-down">
                                    <v-card
                                            height="700"
                                    >
                                        <v-navigation-drawer
                                                permanent
                                                style="width: 400px"
                                        >
                                            <v-list-item>
                                                <v-list-item-avatar color="indigo" size="32">
                                                    <span class="white--text headline">{{teamname[0]}}</span>
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{teamname}}</v-list-item-title></v-list-item-content>
                                                <v-list-item-action>
                                                </v-list-item-action>
                                            </v-list-item>
                                            <v-list two-line subheader>
                                                <v-tabs>
                                                    <v-tab>members</v-tab>
                                                </v-tabs>
                                                <div>
                                                    <v-sheet height="400">
                                                        <v-list-item
                                                                v-for="member in members"
                                                                @click="to_info(member)"
                                                        >
                                                            <v-list-item-avatar color="indigo" size="32">
                                                                <span class="white--text headline">{{member[0]}}</span>
                                                            </v-list-item-avatar>
                                                            <v-list-item-content>
                                                                <v-list-item-title v-text="member"></v-list-item-title>
                                                            </v-list-item-content>

                                                            <v-list-item-action>
                                                            </v-list-item-action>
                                                        </v-list-item></v-sheet>
                                                    <v-divider></v-divider>
                                                    <div style="height: 10px"></div>
                                                    <div class="text-center">
                                                        <v-dialog
                                                                v-model="inviteDialog"
                                                                width="500"
                                                        >
                                                            <template v-slot:activator="{ on }">
                                                                <v-btn
                                                                        color="blue lighten-2"
                                                                        dark
                                                                        v-on="on"
                                                                        @click="show_invite_list"
                                                                >
                                                                    invite friends
                                                                </v-btn>
                                                            </template>

                                                            <v-card>
                                                                <v-card-title
                                                                        class="headline grey lighten-2"
                                                                        primary-title
                                                                >
                                                                    Select Your Friend
                                                                </v-card-title>

                                                                <v-card-text>
                                                                    <v-select
                                                                            v-model="selectedFriends"
                                                                            :items="friends"
                                                                            :menu-props="{ maxHeight: '400' }"
                                                                            label="Select"
                                                                            multiple
                                                                            hint="Pick your friends"
                                                                            persistent-hint
                                                                    ></v-select>
                                                                </v-card-text>

                                                                <v-divider></v-divider>

                                                                <v-card-actions>
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn
                                                                            color="primary"
                                                                            text
                                                                            @click="invite_friends"
                                                                    >
                                                                        invite
                                                                    </v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-dialog>
                                                    </div>
                                                </div>
                                            </v-list>

                                        </v-navigation-drawer>
                                    </v-card>
                                </v-flex>

                                <v-flex md8>
                                    <v-card height = "700" >
                                        <v-card-title>
                                            Activities
                                        </v-card-title>

                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>

                    </v-content>

                    <v-flex xs12>
                        <v-spacer></v-spacer>
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
    import nav_breadcrumb from "../components/new_breadcrumb"
    import Cookies from 'js-cookie'
    import axios from 'axios'



    export default {
        name: "team_page",
        data(){
            return{
                breadcrumbItems:[{
                    text:"Home",
                    disable:true,
                    href:"/main_page"
                }],
                username:"",
                teamid:"",
                teamname:"",
                members:[],
                historyMessage:[],
                activities:[],
                inviteDialog:false,
                friends:[],
                selectedFriends:[]
            }
        },
        components:{
            nav_header,
            nav_footer,
            nav_breadcrumb
        },
        mounted:function () {
            this.username = this.$route.params.username;
            this.teamid = this.$route.params.teamid;

            if(!this.username){
                this.username = Cookies.get("username");
            }
            if(!this.username)this.$router.push({name:"login",});
            this.get_team_info();
        },
        methods:{
            get_team_info(){
                console.log("get team_info");
                axios.get("api/get_team_info", {
                    params:{
                        teamid:this.teamid
                    }
                }).then((res)=>{
                    this.teamname = res.data.result.name;
                    this.members = res.data.result.members;
                    this.activities = res.data.result.activities;
                    this.historyMessage = res.data.result.historyMessage;
                })
            },
            get_friends(){
                axios.get("api/get_friend_list", {
                    params:{
                        username:this.username
                    }
                }).then((res)=>{
                    this.friends = res.data.result.friends;
                })
            },
            to_info(name){
                this.$router.push({
                    name:"user_info",
                    params:{
                        username: name,
                        viewerName: this.username
                    }
                });
            },
            show_invite_list(){
                this.get_friends();
                this.inviteDialog=true;

            },
            invite_friends(){
                this.inviteDialog=false;
                for(var i=0;i<this.selectedFriends.length;i++){
                    axios.post("/api/send_team_invitation", {
                        username: this.username,
                        teamid:this.teamid,
                        teamname:this.teamname,
                        player:this.selectedFriends[i]
                    }).then((res)=>{
                    })
                }
                alert("send invitation succeeds!")
            }
        }
    }
</script>

<style scoped>

</style>
