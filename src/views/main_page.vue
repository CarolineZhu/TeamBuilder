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
                      <v-list-item @click="to_info(username)">
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
                        <v-tabs>
                          <v-tab @click="showTeams=false">friends</v-tab>
                          <v-tab @click="show_teams">teams</v-tab>
                        </v-tabs>
                        <div v-show="!showTeams">
                        <v-sheet height="400">
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
                          </v-list-item-action>
                        </v-list-item></v-sheet>
                        <v-divider></v-divider>
                        <div style="padding: 10px">
                        <v-btn
                                color="success"
                                @click="to_recommendation"
                        >
                          get recommendation
                        </v-btn>

                      </div>
                        </div>
                        <div v-show="showTeams">
                          <v-sheet height="400">
                            <v-list-item
                                    v-for="team in teams"
                                    @click="to_team(team['id'])"
                            >
                              <v-list-item-avatar color="indigo" size="32">
                                <span class="white--text headline">{{team["name"][0]}}</span>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title v-text="team['name']"></v-list-item-title>
                              </v-list-item-content>

                              <v-list-item-action>
                              </v-list-item-action>
                            </v-list-item></v-sheet>
                          <div class="text-center">
                            <v-dialog
                                    v-model="teamDialog"
                                    width="500"
                            >
                              <template v-slot:activator="{ on }">
                                <v-btn
                                        color="blue lighten-2"
                                        dark
                                        v-on="on"
                                >
                                  create team
                                </v-btn>
                              </template>

                              <v-card>
                                <v-card-title
                                        class="headline grey lighten-2"
                                        primary-title
                                >
                                  Create Your Team
                                </v-card-title>

                                <v-card-text>
                                  Team Name:
                                  <v-text-field
                                          v-model="newTeamName"
                                          :counter="15"
                                          required
                                  ></v-text-field>
                                </v-card-text>

                                <v-divider></v-divider>

                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn
                                          color="primary"
                                          text
                                          @click="create_team(newTeamName)"
                                  >
                                    create
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
                    <div>
                      <v-row>
                        <v-col>
                          <v-sheet height="600">
                            <v-calendar
                                    ref="calendar"
                                    :now="today"
                                    :value="today"
                                    :events="events"
                                    color="primary"
                                    type="week"
                            >
                              <!-- the events at the top (all-day) -->
                              <template v-slot:day-header="{ date }">
                                <template v-for="event in eventsMap[date]">
                                  <!-- all day events don't have time -->
                                  <div
                                          v-if="!event.time"
                                          :key="event.title"
                                          class="my-event"
                                          @click=""
                                          v-html="event.title"
                                  ></div>
                                </template>
                              </template>
                              <!-- the events at the bottom (timed) -->
                              <template v-slot:day-body="{ date, timeToY, minutesToPixels }">
                                <template v-for="event in eventsMap[date]">
                                  <!-- timed events -->
                                  <div
                                          v-if="event.time"
                                          :key="event.title"
                                          :style="{ top: timeToY(event.time) + 'px', height: minutesToPixels(event.duration) + 'px' }"
                                          class="my-event with-time"
                                          @click="open(event)"
                                          v-html="event.title"
                                  ></div>
                                </template>
                              </template>
                            </v-calendar>
                          </v-sheet>
                        </v-col>
                      </v-row>

                    </div>

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
              href:"/"
            }],
              username:"",
            friends:[],
              teams:[],
              teamDialog:false,
              today: '2019-11-21',
              events: [
                  {
                      name: 'Weekly CS:GO',
                      start: '2019-11-18 09:00',
                      end: '2019-11-19 10:00',
                  },
                  {
                      name: 'Coh2 free day',
                      start: '2019-11-20',
                  },
                  {
                      name: 'GTA5 mission',
                      start: '2019-11-21 12:30',
                      end: '2019-11-21 15:30',
                  },
              ],
              showTeams:false,
              newTeamName:""
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
          this.get_friends();
          this.get_teams();
          this.$refs.calendar.scrollToTime('08:00')
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
          get_teams(){
              axios.get("api/get_team_list", {
                  params:{
                      username:this.username
                  }
              }).then((res)=>{
                  this.teams = res.data.result.teams;
              })
          },
          show_teams(){
              this.get_teams();
              this.showTeams=true;
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
                      viewerName: this.username
                  }
              });
          },
          to_team(id){
              this.$router.push({
                  name:"team_page",
                  params:{
                      username: name,
                      teamid: id
                  }
              });
          },
          create_team(name){
              axios.post("/api/create_team", {
                  username: this.username,
                 teamname:name
              }).then((res)=>{
                  alert("create team succeeds!");
                  this.teamDialog=false;
                  this.show_teams()
              })
          }
    }
  }
</script>

<style scoped>
  .my-event {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #1867c0;
    color: #ffffff;
    border: 1px solid #1867c0;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    margin-bottom: 1px;
    left: 4px;
    margin-right: 8px;
    position: relative;
  }

  .my-event.with-time {
    right: 4px;
    margin-right: 0px;
  }
</style>
