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
                <v-flex xs12 style="height: 30px; padding-left:40px">
                  <nav_breadcrumb v-bind:breadcrumbItems="breadcrumbItems">
                  </nav_breadcrumb>
                </v-flex>
                <v-flex xs4 class="hidden-sm-and-down">
                  <v-card
                    height="500"
                  >
                    <v-navigation-drawer
                      right
                      permanent
                    >
                        <v-list two-line>
                          <v-avatar>
                            <img src="https://randomuser.me/api/portraits/women/81.jpg">
                          </v-avatar>

                            <v-list-title>Jane Smith</v-list-title>
                        </v-list>
                      <v-list two-line subheader>
                        <v-subheader inset>teams</v-subheader>

                        <v-list-tile
                          v-for="team in teams"
                          :key="team.title"
                          @click=""
                        >
                          <v-list-tile-avatar>
                            <v-icon >folder</v-icon>
                          </v-list-tile-avatar>

                          <v-list-tile-content>
                            <v-list-tile-title v-text="team.title"></v-list-tile-title>
                            <v-list-tile-subtitle v-text="team.subtitle"></v-list-tile-subtitle>
                          </v-list-tile-content>

                          <v-list-tile-action>
                            <v-btn icon>
                              <v-icon color="grey lighten-1">mdi-information</v-icon>
                            </v-btn>
                          </v-list-tile-action>
                        </v-list-tile>
                      </v-list>
                      <v-divider></v-divider>
                    </v-navigation-drawer>
                  </v-card>
                </v-flex>

                <v-flex md8>
                  <v-card height = "500" ></v-card>
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


  export default {
        name: "main",
      data(){
          return{
            breadcrumbItems:[{
              text:"Home",
              disable:true,
              href:"/"
            }],
            teams:[
            { title: 'GTA5', subtitle: 'Jan 9, 2014' },
            { title: 'wow', subtitle: 'Jan 17, 2014' },
            { title: 'cs', subtitle: 'Jan 28, 2014' },
          ]
          }
      },
        components:{
        nav_header,
        nav_footer,
        nav_breadcrumb
      },
    }
</script>

<style scoped>

</style>
