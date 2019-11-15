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

                                        <p style="padding: 10px">Name: {{username}}</p>
                                        <p style="padding: 10px">Platforms:</p>
                                        <v-chip   v-for="(i,index) in gamePlatforms" >
                                            {{platforms[i]}}
                                        </v-chip>
                                        <p style="padding: 10px">playing games: </p>
                                        <v-chip  v-for="(i,index) in playingGames" >
                                            {{games[i]}}
                                        </v-chip>
                                        <p style="padding: 10px">playing time: {{playingTime}}</p>
                                        <p style="padding: 10px">rate:</p>
                                        <star_rate_fixed :starNum="starNum"></star_rate_fixed>
                                        <div v-show="username!==viewerName">
                                        <p style="padding: 10px">Would you like to rate your friend?</p>
                                        <star_rate :typeIndex="0" @changeRate="changeRate"></star_rate>
                                        <v-btn
                                                color="success"
                                                @click="deleteFriend"
                                                style="margin-top: 10px"
                                                v-show="selectedStarNum>=0"
                                        >
                                            Rate Friend
                                        </v-btn>
                                        </div>
                                        <div style="height: 10px"></div>
                                        <v-flex xs12>

                                            <v-dialog
                                                    v-model="deleteDialog"
                                                    width="500"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-btn
                                                            color="red"
                                                            dark
                                                            v-on="on"
                                                            v-show="username!==viewerName"
                                                    >
                                                        Delete Friend
                                                    </v-btn>
                                                </template>

                                                <v-card>
                                                    <v-card-title
                                                            class="headline grey lighten-2"
                                                            primary-title
                                                    >
                                                        Notice
                                                    </v-card-title>

                                                    <v-card-text>
                                                        Are you sure you want to delete your friend?
                                                    </v-card-text>

                                                    <v-divider></v-divider>

                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn
                                                                color="primary"
                                                                text
                                                                @click="deleteFriend"
                                                        >
                                                           yes
                                                        </v-btn>
                                                        <v-btn
                                                                color="primary"
                                                                text
                                                                @click="dialog = false"
                                                        >
                                                            No
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-flex>
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
    import star_rate_fixed from "../components/star_rate_fixed"
    import axios from 'axios'
    import {data} from "../js/data"
    import star_rate from "../components/star_rate"

    export default {
        name: "user_info",
        data(){
            return {
                userid:"",
                username:"",
                viewerName:"",
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
                starNum:2,
                selectedStarNum:-1,
                deleteDialog:false
            }
        },
        mounted:
            function(){
                this.username=this.$route.params.username;
                this.viewerName = this.$route.params.viewerName;
                this.getInfo()
            },
        components:{
            nav_header,
            nav_footer,
            nav_breadcrumb,
            my_form,
            star_rate_fixed,
            star_rate,
        },
        methods:{
            getInfo(){
                axios.get("/api/get_user_info", {
                    params: {
                        username: this.username
                    }
                }).then((res)=>{
                    this.gamePlatforms= res.data.result.platform;
                    this.playingGames = res.data.result.playingGames;
                    switch(res.data.result.playingTime)
                    {
                        case 0:
                            this.playingTime = "Morning";
                        case 1:
                            this.playingTime = "Afternoon";
                        case 2:
                            this.playingTime = "Evening";
                        case 3:
                            this.playingTime = "Weekends";
                    }
                })
            },
            changeRate(data){
                this.selectedStarNum = data["starNum"];
            },
            deleteFriend(){
                this.deleteDialog = false;

            },
            rateFriend(){

            }
        }
    }
</script>

<style scoped>

</style>
