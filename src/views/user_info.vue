<template>
    <div id="app" style="height: 1000px">
        <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
        <v-app id="inspire" style="height: 1000px">
            <v-container grid-list-md style="margin:0px">
                <v-layout row wrap>
                    <v-flex xs12 >
                        <nav_header ref="header"></nav_header>
                    </v-flex>
                    <v-flex xs12 style="height: 30px">
                        <nav_breadcrumb v-bind:breadcrumbItems="breadcrumbItems"></nav_breadcrumb>
                    </v-flex>
                    <v-flex xs12>
                        <v-content style="padding: 10px;padding-bottom: 20px;">
                            <v-card style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, 0%); width: 500px; margin: 20px">
                                <my_form v-bind:mdShow="true">
                                    <div slot="text_fields" >
                                        <h2>Information</h2>

                                        <p>Name: {{username}}</p>
                                        <p>Platforms:</p>
                                        <v-chip   v-for="(i,index) in gamePlatforms" >
                                            {{platforms[i]}}
                                        </v-chip>
                                        <p>playing games: </p>
                                        <v-chip  v-for="(i,index) in playingGames" >
                                            {{games[i]}}
                                        </v-chip>
                                        <p>playing time: {{playingTime}}</p>

                                    </div>
                                </my_form>
                            </v-card>
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
    import my_form from "../components/Form"
    import nav_breadcrumb from "../components/new_breadcrumb"
    import axios from 'axios'
    import {data} from "../js/data"

    export default {
        name: "user_info",
        data(){
            return {
                userid:"",
                username:"",
                email:"",
                games: data["games"],
                types: data["types"],
                times: data["times"],
                platforms: data["platforms"],
                gamePlatforms:[],
                gameTypes:[],
                playingGames:[],
                playingTime:"",
                breadcrumbItems:[{
                    text:"Home",
                    disable:true,
                    href:"/"
                }],
            }
        },
        mounted:
            function(){
                this.username=this.$route.params.username;
                this.get_info()
            },
        components:{
            nav_header,
            nav_footer,
            nav_breadcrumb,
            my_form
        },
        methods:{
            get_info(){
                axios.get("/api/get_user_info", {
                    params: {
                        username: this.username
                    }
                }).then((res)=>{
                    console.log(res.data);
                    this.gamePlatforms= res.data.result.platform;
                    this.playingGames = res.data.result.playingGames;
                    this.playingTime = res.data.result.playingTime;
                })
            }

        }
    }
</script>

<style scoped>

</style>
