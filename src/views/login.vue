<template>
  <div id="app" style="height: 450px">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">
    <v-app id="inspire" style="height: 800px">
      <v-container grid-list-md style="margin:0px">
        <v-layout row wrap>
          <v-flex xs12 >
            <nav_header ref="header"></nav_header>
          </v-flex>
          <v-flex xs12 style="height: 30px">
            <nav_breadcrumb v-bind:breadcrumbItems="breadcrumbItems"></nav_breadcrumb>
          </v-flex>
          <v-flex xs12>
            <v-content style="padding: 10px;padding-bottom: 20px">
              <v-card style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, 0%); width: 500px">
                <my_form v-bind:mdShow="true">
                  <div slot="text_fields" >
                    <h2>Login</h2>
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
                  </div>
                  <div slot="btns">
                    <v-layout row wrap style="text-align: center">
                      <v-flex xs12>
                        <v-btn
                          color="success"
                          @click="login"
                          style="width: 100px"
                        >
                          Login
                        </v-btn>
                        <v-btn
                                color="red"
                                @click="to_register"
                                style="width: 100px"
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
  import Cookies from 'js-cookie'
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
        tipShow:false,
        userid:"",
        username:"",
        password:"",
        loginFlag:false,
        selectedType:"",
        gameTypes:[],
        playingGames:[],
        errorTip:"username or password wrong.",
        id:"",
        breadcrumbItems:[{
          text:"Home",
          disable:true,
          href:"/"
        },{
          text:"Login",
          disable:false,
          href:"/Login"
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
      login(){
        if(this.username==="" || this.password===""){
          this.errorTip="username or password cannot be empty!";
          this.tipShow=true;
        }else{
          axios.post("/api/login", {
            username: this.username,
            password: this.password
          }).then((res)=>{
            if(res.data.status==="200"){
              this.userid=res.data.result.userid;
              this.loginFlag=true;
              this.username=res.data.result.username;
              console.log(res.data.result.friends);
                sessionStorage.setItem("friends", JSON.stringify(res.data.result.friends));
                sessionStorage.setItem("messageNum", res.data.result.messageNum);
                this.to_main()
            }else{
              this.errorTip=res.data.message;
                this.tipShow=true;

            }
          },(error)=>{
            alert("cannot connect to server.");
          })
        }
      },
        to_main(){
            this.$router.push({
                name:"main_page",
                params:{
                    username: this.username,
                }
            });
        },
        to_register(){
            this.$router.push({
                name:"register",
            });
        }
    }
  }
</script>

<style scoped>

</style>

