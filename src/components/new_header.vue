<template>
  <div>
  <v-app-bar color="black" dark app>
    <v-toolbar-title>teamBuilder</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn text @click="logout" v-show="loginFlag" dark>Logout</v-btn>
      <v-btn text @click="to_messages">
        <v-badge right color="red" v-show="messageNum !== 0">
          <span slot="badge">{{messageNum}}</span>
          <v-icon
                medium
                color="white lighten-1"
        >
          email
        </v-icon>
        </v-badge>

        <v-icon
                medium
                color="white lighten-1"
                v-show="messageNum===0"
        >
          email
        </v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
  </div>
</template>

<script>
  import my_form from "../components/Form"
  import axios from "axios"
  import Cookies from "js-cookie"
  
    export default {
        name: "new_header",
      props:["sideShow"],
      data(){
          return {
            tipShow:false,
            userid:"",
            username:"",
            password:"",
            rpassword:"",
            loginFlag:false,
            email:"",
              messageNum:0,
            errorTip:"username or password wrong.",
            id:"",

          }
      },
      mounted:
          function(){
        this.check_login();
      },
    components:{
      my_form
    }
    ,
      methods:{
        logout(){
          Cookies.remove('username');
          Cookies.remove('userid');
          Cookies.remove('messageNum');
          this.$router.push(
            '/login'
          );
          this.loginFlag=false;
        },
        check_login(){
          this.id=Cookies.get('userid');
          if(this.id){
            this.loginFlag=true;
            this.username=Cookies.get('username');
            this.messageNum = parseInt(sessionStorage.getItem("messageNum"))||0;
          }
        },
        to_messages(){
            this.$router.push('/messages');
        },
          change_message_num(num){
            this.messageNum+=num;
              sessionStorage.setItem("messageNum", this.messageNum)
          }
      }
    }
</script>

<style scoped>

</style>
