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
                                                <p>Recommendations:</p>
                                            </v-toolbar>
                                            <v-list v-for="(item, index) in recommendationList" three-line style="padding: 0px;" >
                                                <v-list-item >
                                                    <v-layout align-center justify-center row fill-height >
                                                        <v-flex xs1 >
                                                            {{index+1}}.
                                                        </v-flex>
                                                        <v-flex v-bind:class="{'xs2':!is_small, 'xs6':is_small}" >
                                                            <div style="padding-left:10px">
                                                                <v-avatar color="indigo" size="26">
                                                                    <span class="white--text headline">{{item[1]["username"][0]}}</span>
                                                                </v-avatar>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex v-bind:class="{'xs4':!is_small, 'xs6':is_small}">
                                                            <a>{{item[1]["username"]}}</a>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-list-item-title style="display: inline">
                                                                <v-rating
                                                                        v-show = "item[1]['rating']!=0"
                                                                        v-model="item[1]['rating']"
                                                                        color="yellow darken-3"
                                                                        background-color="grey darken-1"
                                                                        empty-icon="$ratingFull"
                                                                        half-increments
                                                                        readonly="true"
                                                                ></v-rating>
                                                                <p v-show="item[1]['rating']===0">No rate</p>
                                                            </v-list-item-title>
                                                        </v-flex>
                                                        <v-flex xs1 v-show="!is_small">
                                                            <v-btn
                                                                    icon
                                                                    v-on:click="expand(index)"
                                                            >
                                                                <v-icon v-show="shows[index]">mdi-chevron-up</v-icon>
                                                                <v-icon v-show="!shows[index]">mdi-chevron-down</v-icon>
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-btn
                                                                    color="primary"
                                                                    @click="invite(index)"
                                                            >
                                                                Invite
                                                            </v-btn>
                                                        </v-flex>

                                                        <v-flex xs10>
                                                            <v-progress-linear color="green"
                                                                               v-bind:value="item[0]*100"></v-progress-linear>
                                                        </v-flex>
                                                        <v-flex xs2>
                                                            {{item[0]*100}}% match
                                                        </v-flex>
                                                    <v-flex xs12>
                                                    <v-expand-transition>
                                                        <div v-show="shows[index]">
                                                            <v-divider></v-divider>

                                                            <v-card-text>
                                                                <div align="left">
                                                                    Games:
                                                                    <v-chip v-for='i in item[1].playingGames' v-bind:color="isMatched(i)">
                                                                        {{games[i]}}
                                                                    </v-chip>
                                                                    <p>Time: <v-chip color="green">{{times[item[1]["playingTime"]]}}</v-chip></p>
                                                                </div>

                                                            </v-card-text>
                                                        </div>
                                                    </v-expand-transition>
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
    import star_rate_fixed from "../components/star_rate_fixed"

    import {data} from "../js/data"


    export default {
        name: "recommendation",
        data(){
            return {
                breadcrumbItems:[{
                    text:"Home",
                    disable:true,
                    href:"/"
                }],
                username:"",
                recommendationList:[],
                is_small:false,
                userGames:[],
                userPlatforms:[],
                times: data["times"],
                games: data["games"],
                shows:[false, false,false, false,false, false,false, false,false, false],


            }

        },
        components:{
            nav_header,
            nav_footer,
            nav_breadcrumb,
            star_rate_fixed,
        },
        mounted: function () {
            this.username = this.$route.params.username;
            if(!this.username){
                this.username = Cookies.get("username");
            }
            if(!this.username)this.$router.push({name:"login",});
            this.get_recommendation();
            this.get_user_info()

        },
        methods:{
            get_recommendation() {
                axios.get("/api/get_recommendation", {
                    params: {
                        username: this.username
                    }
                }).then((res)=>{
                    this.recommendationList=res.data.result.recommendationList;
                })
            },
            get_user_info(){
                axios.get("/api/get_user_info", {
                    params: {
                        username: this.username
                    }
                }).then((res)=>{
                    console.log(res.data.result);
                    this.userPlatforms= res.data.result.platform;
                    this.userGames = res.data.result.playingGames;

                })
            },
            expand(index){
                this.shows[index] = !this.shows[index];
                this.shows.push(false);
                this.shows.pop();
            },
            invite(index){
                axios.post("/api/send_invitation", {
                    username: this.username,
                    player:this.recommendationList[index][1]["username"]
                }).then((res)=>{
                    alert("sent invitation to player.");
                    this.recommendationList.splice(index,1);
                    console.log(res);
                })
            },
            isMatched(index){
                if(this.userGames.includes(index)){
                    return "green";
                }else{
                    return "";
                }
            }
        }

    }
</script>

<style scoped>

</style>