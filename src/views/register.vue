<template>
  <div id="app" style="height: 1000px">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
    <v-app id="inspire" style="height: 1700px">
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
                          <h2>Register</h2>
                          <div class="subheading" style="color: red" v-show="tipShow"> {{errorTip}} </div>
                          <v-text-field
                            v-model="username"
                            :counter="15"
                            :rules="nameRules"
                            label="Name"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-model="password"
                            :rules="passwordRules"
                            label="Password"
                            type="password"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-model="rpassword"
                            :rules="rpasswordRules"
                            label="Repeat Password"
                            type="password"
                            required
                          ></v-text-field>
                          <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="Email"
                            required
                          ></v-text-field>
                          <h2>Questions</h2>
                          <p>What kind of game platform are you playing?</p>
                          <v-chip  @click="closePlatformChip(index)" v-for="(value,index) in gamePlatforms" >
                            {{platforms[value]}}
                          </v-chip>
                          <v-layout row wrap style="text-align: center">
                            <v-flex xs12>
                              <v-select v-model="selectedPlatform" :items="platforms" label="choose game platform" outlined @change="addPlatform()">
                              </v-select>
                            </v-flex>
                          </v-layout>
                          <p>What's your insterested game types?</p>

                          <div style="align-content: center"  v-for="(type,index) in types" >
                            <p>{{type}} :</p>
                            <star_rate :typeIndex="index" @changeRate="changeRate">
                          </star_rate>
                          </div>

                          <p>Which games are you currently playing?</p>
                          <v-chip  @click="closeGameChip(index)" v-for="(value,index) in playingGames" >
                            {{games[value]}}
                          </v-chip>
                          <v-layout row wrap style="text-align: center">
                            <v-flex xs12>
                              <v-select v-model="selectedGame" :items="games" label="choose game" outlined @change="addGame()">
                              </v-select>
                            </v-flex>
                          </v-layout>
                          <p>What time are you usually playing?</p>
                          <v-select v-model="playingTime" :items="times" label="choose playing time" outlined>
                          </v-select>
                        </div>
                        <div slot="btns">
                          <v-layout row wrap style="text-align: center">
                            <v-flex xs12>
                              <v-btn
                                color="success"
                                @click="register"
                              >
                                Register
                              </v-btn>
                            </v-flex>
                          </v-layout>
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
  import star_rate from "../components/star_rate"
  import {data} from "../js/data"
  import axios from 'axios'

    export default {
        name: "register",
        data: function () {
            return {
                nameRules: [
                    v => !!v || 'Name is required',
                    v => (v && v.length <= 15) || 'Name must be less than 15 characters'
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                ],
                rpasswordRules: [
                    v => !!v || 'Password is required',
                    v => v === this.password || 'Password is not consistant'
                ],
                emailRules: [
                    value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid e-mail.'
                    }
                ],
                loginmdShow: false,
                registermdShow: false,
                tipShow: false,
                userid: "",
                username: "",
                password: "",
                rpassword: "",
                loginFlag: false,
                email: "",
                games: data["games"],
                types: data["types"],
                times: data["times"],
                platforms: data["platforms"],
                selectedPlatform: "",
                gamePlatforms: [],
                selectedType: "",
                gameTypes: [0, 0, 0, 0, 0, 0, 0, 0],
                playingGames: [],
                playingRole: "",
                playingTime: "",
                selectedGame: "",
                cartNum: 0,
                errorTip: "username or password wrong.",
                id: "",
                breadcrumbItems: [{
                    text: "Home",
                    disable: true,
                    href: "/"
                }, {
                    text: "register",
                    disable: false,
                    href: "/register"
                }]
            }
        },
      components:{
        nav_header,
        nav_footer,
        nav_breadcrumb,
        my_form, star_rate
      },
      methods:{
        register(){
          if(this.username==="" || this.password===""||this.rpassword===""||this.email===""){
            this.errorTip="username or password cannot be empty!";
            this.tipShow=true;
            return;
          }
          if(this.password !== this.rpassword){
            this.errorTip="two passwords inconsistant!";
            this.tipShow=true;
          }else{
            axios.post("/api/register", {
              username: this.username,
              password: this.password,
              email: this.email,
                playingGames:this.playingGames,
                favoriteGameType:this.gameTypes,
                playingTime:this.playingTime,
                platform:this.gamePlatforms,
                team:[]
            }).then((res)=>{
              if(res.data.status==="200"){
                alert("success register!");
                  this.$router.push({
                      name:"login",
                  });
              }else{
                this.errorTip=res.data.message;
                this.tipShow=true;
              }
            },(error)=>{
                console.log(error);
              alert("cannot connect to server.");
            })
          }
        },
          closePlatformChip(index){
              this.gamePlatforms.splice(index, 1);
          },
          addPlatform(){
            if(this.gamePlatforms.indexOf(this.selectedPlatform)===-1)
                this.gamePlatforms.push(this.platforms.indexOf(this.selectedPlatform));
          },
        closeGameChip(index){
          this.playingGames.splice(index, 1);
        },
        addGame(){
            if(this.playingGames.indexOf(this.selectedGame)===-1)
              this.playingGames.push(this.games.indexOf(this.selectedGame));
        },
        changeRate(data){
            this.gameTypes[data["typeIndex"]] = data["starNum"];
        }
      }
    }
</script>

<style scoped>

</style>
