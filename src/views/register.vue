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
                          <v-chip  @click="closePlatformChip(index)" v-for="(type,index) in gamePlatforms" >
                            {{type}}
                          </v-chip>
                          <v-layout row wrap style="text-align: center">
                            <v-flex xs12>
                              <v-select v-model="selectedPlatform" :items="platforms" label="choose game platform" outlined @change="addPlatform()">

                              </v-select>
                            </v-flex>
                          </v-layout>
                          <p>What's your insterested game types?</p>
                          <v-chip  @click="closeTypeChip(index)" v-for="(type,index) in gameTypes" >
                            {{type}}
                          </v-chip>
                          <v-layout row wrap style="text-align: center">
                            <v-flex xs12>
                          <v-select v-model="selectedType" :items="types" label="choose game type" outlined @change="addType()">

                          </v-select>
                            </v-flex>
                          </v-layout>
                          <p>Which games are you currently playing?</p>
                          <v-chip  @click="closeGameChip(index)" v-for="(type,index) in playingGames" >
                            {{type}}
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
                          <p>In games, you are more willing to be a?</p>
                          <v-select v-model="playingRole" :items="roles" label="choose playing time" outlined>
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
  import axios from 'axios'

    export default {
        name: "register",
      data(){
        return {
          nameRules:[
            v => !!v || 'Name is required',
            v => (v && v.length <= 15) || 'Name must be less than 15 characters'
          ],
          passwordRules:[
            v => !!v || 'Password is required',
          ],
          rpasswordRules:[
            v => !!v || 'Password is required',
            v => v === this.password || 'Password is not consistant'
          ],
          emailRules:[
            value => {
              const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              return pattern.test(value) || 'Invalid e-mail.'
            }
          ],
          loginmdShow:false,
          registermdShow:false,
          tipShow:false,
          userid:"",
          username:"",
          password:"",
          rpassword:"",
          loginFlag:false,
          email:"",
          games:["CS:Go", "Dota2", "Destiny 2", "GTA5", "League of Legends", "PLAYERUNKNOWN'S BATTLEGROUNDS",  "Tom Clancy's Rainbow Six Siege"],
          types:["MOBA", "RPG", "FPS","MMORPG", "Action", "Strategy", "Sports", "Racing"],
          times:["morning", "afternoon", "evening", "weekends"],
          roles:["attacker", "healer", "protector"],
            platforms:["PC", "PS4", "XBOX", "NS"],
            selectedPlatform:"",
          gamePlatforms:[],
          selectedType:"",
          gameTypes:[],
          playingGames:[],
          playingRole:"",
          playingTime:"",
          selectedGame:"",
          cartNum:0,
          errorTip:"username or password wrong.",
          id:"",
          breadcrumbItems:[{
            text:"Home",
            disable:true,
            href:"/"
          },{
            text:"register",
            disable:false,
            href:"/register"
          }]
        }
      },
      components:{
        nav_header,
        nav_footer,
        nav_breadcrumb,
        my_form
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
                role:this.role,
                playingTime:this.playingTime,
                platform:this.gamePlatforms
            }).then((res)=>{
              if(res.data.status==="200"){
                alert("success register!");
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
              this.gamePlatforms.push(this.selectedPlatform);
          },
        closeTypeChip(index){
          this.gameTypes.splice(index, 1);
        },
        addType(){
          this.gameTypes.push(this.selectedType);
        },
        closeGameChip(index){
          this.playingGames.splice(index, 1);
        },
        addGame(){
          this.playingGames.push(this.selectedGame);
        },


      }
    }
</script>

<style scoped>

</style>
