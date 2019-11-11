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
                                            <v-list v-for="(item, index) in invitations" three-line style="padding: 0px;" >
                                                <v-list-item >
                                                    <v-layout align-center justify-center row fill-height >
                                                        <v-flex xs1 >
                                                            {{index+1}}
                                                        </v-flex>
                                                        <v-flex v-bind:class="{'xs2':!is_small, 'xs6':is_small}" >
                                                            <div style="padding-left:10px">
                                                                <v-avatar color="indigo" size="26">
                                                                    <span class="white--text headline">{{item["username"][0]}}</span>
                                                                </v-avatar>
                                                            </div>
                                                        </v-flex>
                                                        <v-flex v-bind:class="{'xs4':!is_small, 'xs6':is_small}">
                                                            <a>{{item["username"]}}</a>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-list-item-title style="display: inline">rate: 5</v-list-item-title>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-btn
                                                                    color="red"
                                                                    @click="deny"
                                                            >
                                                                Deny
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs2 v-show="!is_small">
                                                            <v-btn
                                                                    color="success"
                                                                    @click="accept"
                                                            >
                                                                Accept
                                                            </v-btn>
                                                        </v-flex>
                                                        <v-flex xs12>
                                                            <v-expand-transition>
                                                                <div v-show="shows[index]">
                                                                    <v-divider></v-divider>

                                                                    <v-card-text>
                                                                        <div align="left">
                                                                            Games:
                                                                            <v-chip v-for='i in item[1].playingGames'>
                                                                                {{games[i]}}
                                                                            </v-chip>
                                                                            <p>Time: {{times[item[1]["playingTime"]]}}</p>
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
    import {data} from "../js/data"


    export default {
        name: "messages",
        data(){
            return {
                breadcrumbItems:[{
                    text:"Home",
                    disable:true,
                    href:"/"
                }],
                username:"",
                invitations:[],
                is_small:false,
                times: data["times"],
                games: data["games"],
                shows:[false, false,false, false,false, false,false, false,false, false]

            }

        },
        components:{
            nav_header,
            nav_footer,
            nav_breadcrumb
        },
        mounted: function () {
            this.username = this.$route.params.username;
            this.get_recommendation();

        },
        methods:{
            get_invitations() {
                axios.get("/api/get_recommendation", {
                    params: {
                        username: this.username
                    }
                }).then((res)=>{
                    this.recommendationList=res.data.result.recommendationList;
                })
            },
            accept(){

            },
            deny(){

            }
        }

    }
</script>

<style scoped>

</style>