<template>
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
                    height="800"
                  >
                    <v-navigation-drawer
                      permanent
                      style="width: 400px"
                    >
                      <v-list-item>
                          <v-list-item-avatar>
                            <img src="https://randomuser.me/api/portraits/women/81.jpg">
                          </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{username}}</v-list-item-title></v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon>
                            <v-icon color="grey lighten-1">mdi-information</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list two-line subheader>
                        <v-subheader inset>friends</v-subheader>

                        <v-list-item
                          v-for="friend in friends"
                          @click="to_info(friend)"
                        >
                          <v-list-item-avatar color="indigo" size="32">
                            <span class="white--text headline">{{friend[0]}}</span>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title v-text="friend"></v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-action>
                            <v-btn icon>
                              <v-icon color="grey lighten-1">mdi-information</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                      <v-divider></v-divider>
                      <div style="padding: 10px">
                        <v-btn
                                color="success"
                                @click="to_recommendation"
                        >
                          get recommendation
                        </v-btn>

                      </div>
                    </v-navigation-drawer>
                  </v-card>
                </v-flex>

                <v-flex md8>
                  <v-card height = "800" >
                    <v-card-title>
                      Activities
                    </v-card-title>
                    <v-card-text>
                      No activity available.

                    </v-card-text>
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
        name: "main_page",
      data(){
          return{
            breadcrumbItems:[{
              text:"Home",
              disable:true,
              href:"/main_page"
            }],
              username:"",
            friends:[],

          }
      },
        components:{
        nav_header,
        nav_footer,
        nav_breadcrumb
      },
      mounted:function () {
          this.username = this.$route.params.username;
          if(!this.username){
              this.username = Cookies.get("username");
          }
          if(!this.username)this.$router.push({name:"login",});
          this.get_friends()
      },
      methods:{
            get_friends(){
                axios.get("api/get_friend_list", {
                    params:{
                        username:this.username
                    }
                }).then((res)=>{
                    this.friends = res.data.result.friends;
                })
            },
          to_recommendation() {
              this.$router.push({
                  name:"recommendation",
                  params:{
                      username: this.username,
                  }
              });
      },
          to_info(name){
              this.$router.push({
                  name:"user_info",
                  params:{
                      username: name,
                  }
              });
          }
    }
  }
</script>

<style scoped>

</style>
