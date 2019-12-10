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
                                            <v-list-item>
                                                <v-list-item-avatar color="indigo" size="32">
                                                    <span class="white--text headline">{{teamname[0]}}</span>
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{teamname}}</v-list-item-title></v-list-item-content>
                                                <v-list-item-action>
                                                </v-list-item-action>
                                            </v-list-item>
                                            <v-list two-line subheader>
                                                <v-tabs>
                                                    <v-tab>members</v-tab>
                                                </v-tabs>
                                                <div>
                                                    <v-sheet height="400">
                                                        <v-list-item
                                                                v-for="member in members"
                                                                @click="to_info(member)"
                                                        >
                                                            <v-list-item-avatar color="indigo" size="32">
                                                                <span class="white--text headline">{{member[0]}}</span>
                                                            </v-list-item-avatar>

                                                            <v-list-item-content>
                                                                <svg                                                             v-show="member===creator"
                                                                                                                                 viewBox="0 0 24 24" width="20px" height="20px" fill="gold">
                                                                    <path d="M12 8L15 13.2L18 10.5L17.3 14H6.7L6 10.5L9 13.2L12 8M12 4L8.5 10L3 5L5 16H19L21 5L15.5 10L12 4M19 18H5V19C5 19.6 5.4 20 6 20H18C18.6 20 19 19.6 19 19V18Z"/>
                                                                </svg>

                                                                <v-list-item-title v-text="member">

                                                                </v-list-item-title>
                                                            </v-list-item-content>

                                                            <v-list-item-action>
                                                            </v-list-item-action>
                                                        </v-list-item></v-sheet>
                                                    <v-divider></v-divider>
                                                    <div style="height: 10px"></div>
                                                    <div class="text-center">
                                                        <v-dialog
                                                                v-model="inviteDialog"
                                                                width="500"
                                                        >
                                                            <template v-slot:activator="{ on }">
                                                                <v-btn
                                                                        color="primary lighten-2"
                                                                        dark
                                                                        v-on="on"
                                                                        @click="show_invite_list"
                                                                >
                                                                    invite friends
                                                                </v-btn>
                                                            </template>

                                                            <v-card>
                                                                <v-card-title
                                                                        class="headline grey lighten-2"
                                                                        primary-title
                                                                >
                                                                    Select Your Friend
                                                                </v-card-title>

                                                                <v-card-text>
                                                                    <v-select
                                                                            v-model="selectedFriends"
                                                                            :items="friends"
                                                                            :menu-props="{ maxHeight: '400' }"
                                                                            label="Select"
                                                                            multiple
                                                                            hint="Pick your friends"
                                                                            persistent-hint
                                                                    ></v-select>
                                                                </v-card-text>

                                                                <v-divider></v-divider>

                                                                <v-card-actions>
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn
                                                                            color="primary"
                                                                            text
                                                                            @click="invite_friends"
                                                                    >
                                                                        invite
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
                                            <v-spacer></v-spacer>
                                            <v-dialog
                                                    v-model="addActivityDialog"
                                                    width="500"
                                            >
                                                <template v-slot:activator="{ on }">
                                                    <v-btn
                                                            v-show="isCreator"
                                                            color="primary lighten-2"
                                                            dark
                                                            v-on="on"
                                                            @click="show_add_activity"
                                                    >
                                                            Add
                                                    </v-btn>
                                                </template>

                                                <v-card>
                                                    <v-card-title
                                                            class="headline grey lighten-2"
                                                            primary-title
                                                    >
                                                        Add New Activity
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <v-text-field
                                                                v-model="newActivityTitle"
                                                                :counter="15"
                                                                label="Activity Title"
                                                                :rules="rule"
                                                                required
                                                        ></v-text-field>
                                                    </v-card-text>
                                                    <v-card-text>
                                                        <v-textarea
                                                                outlined
                                                                v-model="newActivityContent"
                                                                :counter="100"
                                                                label="Activity Content"
                                                                :rules="rule"
                                                                required
                                                        ></v-textarea>
                                                    </v-card-text>

                                                    <v-row>
                                                        <v-col cols="11" sm="5">
                                                    <v-dialog
                                                            ref="StartDateDialog"
                                                            v-model="startDatePickerDialog"
                                                            :return-value.sync="newActivityStartDate"
                                                            persistent
                                                            width="290px"
                                                    >
                                                        <template v-slot:activator="{ on }">
                                                            <v-text-field
                                                                    style="padding-left: 30px"
                                                                    v-model="newActivityStartDate"
                                                                    label="Start Date"
                                                                    prepend-icon="event"
                                                                    readonly
                                                                    v-on="on"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker v-model="newActivityStartDate" scrollable>
                                                            <v-spacer></v-spacer>
                                                            <v-btn text color="primary" @click="startDatePickerDialog = false">Cancel</v-btn>
                                                            <v-btn text color="primary" @click="$refs.StartDateDialog.save(newActivityStartDate)">OK</v-btn>
                                                        </v-date-picker>
                                                    </v-dialog></v-col>
                                                        <v-col cols="11" sm="5">
                                                            <v-dialog
                                                                    ref="StartTimeDialog"
                                                                    v-model="startTimePickerDialog"
                                                                    :return-value.sync="newActivityStartTime"
                                                                    persistent
                                                                    width="290px"
                                                            >
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field
                                                                            v-model="newActivityStartTime"
                                                                            label="Start Time"
                                                                            prepend-icon="event"
                                                                            readonly
                                                                            v-on="on"
                                                                    ></v-text-field>
                                                                </template>
                                                                <v-time-picker v-model="newActivityStartTime" scrollable>
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn text color="primary" @click="startTimePickerDialog = false">Cancel</v-btn>
                                                                    <v-btn text color="primary" @click="$refs.StartTimeDialog.save(newActivityStartTime)">OK</v-btn>
                                                                </v-time-picker>
                                                            </v-dialog></v-col></v-row>
                                                    <v-row>
                                                        <v-col cols="11" sm="5">
                                                            <v-dialog
                                                                    ref="EndDateDialog"
                                                                    v-model="endDatePickerDialog"
                                                                    :return-value.sync="newActivityEndDate"
                                                                    persistent
                                                                    width="290px"
                                                            >
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field
                                                                            style="padding-left: 30px"
                                                                            v-model="newActivityEndDate"
                                                                            label="End Date"
                                                                            prepend-icon="event"
                                                                            readonly
                                                                            v-on="on"
                                                                    ></v-text-field>
                                                                </template>
                                                                <v-date-picker v-model="newActivityEndDate" scrollable>
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn text color="primary" @click="endDatePickerDialog = false">Cancel</v-btn>
                                                                    <v-btn text color="primary" @click="$refs.EndDateDialog.save(newActivityEndDate)">OK</v-btn>
                                                                </v-date-picker>
                                                            </v-dialog></v-col>
                                                        <v-col cols="11" sm="5">
                                                            <v-dialog
                                                                    ref="EndTimeDialog"
                                                                    v-model="endTimePickerDialog"
                                                                    :return-value.sync="newActivityEndTime"
                                                                    persistent
                                                                    width="290px"
                                                            >
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field
                                                                            v-model="newActivityEndTime"
                                                                            label="End Time"
                                                                            prepend-icon="event"
                                                                            readonly
                                                                            v-on="on"
                                                                    ></v-text-field>
                                                                </template>
                                                                <v-time-picker v-model="newActivityEndTime" scrollable>
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn text color="primary" @click="endTimePickerDialog = false">Cancel</v-btn>
                                                                    <v-btn text color="primary" @click="$refs.EndTimeDialog.save(newActivityEndTime)">OK</v-btn>
                                                                </v-time-picker>
                                                            </v-dialog></v-col></v-row>
                                                    <v-divider></v-divider>

                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn
                                                                color="primary"
                                                                text
                                                                @click="add_activities"
                                                                style="padding-right: 30px"
                                                        >
                                                            Add Activity
                                                        </v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-card-title>

                                        <v-tabs
                                                color="primary"
                                        >
                                            <v-tab @click="showPast=false">
                                                Incoming
                                            </v-tab>
                                            <v-tab @click="showPast=true">
                                                History
                                            </v-tab>
                                        </v-tabs>
                                        <v-sheet>
                                        <v-card v-show="!showPast"
                                                v-for="activity in activities"
                                                style="margin: 10px"
                                                max-width=""
                                        >
                                            <v-card-text>
                                                <p class="display-1 text--primary float: left">
                                                    {{activity["title"]}}
                                                </p><v-divider></v-divider>
                                                <p>start : {{activity["beginDate"].replace('T', ' ')}} <br>end : {{activity["endDate"].replace('T', ' ')}}</p>

                                                <div class="text--primary">
                                                    <p style="font-size: 20px">{{activity["content"]}}</p>
                                                </div>
                                            </v-card-text>
                                            <v-card-actions>
                                            </v-card-actions>
                                        </v-card>
                                            <v-card v-show="showPast"
                                                    v-for="activity in pastActivities"
                                                    style="margin: 10px"
                                                    max-width=""
                                            >
                                                <v-card-text>
                                                    <p class="display-1 text--primary float: left">
                                                        {{activity["title"]}}
                                                    </p><v-divider></v-divider>
                                                    <p>start : {{activity["beginDate"].replace('T', ' ')}} <br>end : {{activity["endDate"].replace('T', ' ')}}</p>

                                                    <div class="text--primary">
                                                        <p style="font-size: 20px">{{activity["content"]}}</p>
                                                    </div>
                                                </v-card-text>
                                                <v-card-actions>
                                                </v-card-actions>
                                            </v-card>
                                        </v-sheet>
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
        name: "team_page",
        data(){
            return{
                breadcrumbItems:[{
                    text:"Home",
                    disable:true,
                    href:"/"
                }],
                rule: [
                    value => !!value || 'Required.'],
                username:"",
                teamid:"",
                teamname:"",
                members:[],
                historyMessage:[],
                activities:[],
                pastActivities:[],
                inviteDialog:false,
                friends:[],
                selectedFriends:[],
                addActivityDialog:false,
                newActivityTitle:"",
                newActivityContent:"",
                newActivityStartTime:"",
                newActivityStartDate:new Date().toISOString().substr(0, 10),
                newActivityEndDate:new Date().toISOString().substr(0, 10),
                newActivityEndTime:"",
                startDatePickerDialog:false,
                startTimePickerDialog:false,
                endDatePickerDialog:false,
                endTimePickerDialog:false,
                showPast:false,
                isCreator:false,
                creator:""
            }
        },
        components:{
            nav_header,
            nav_footer,
            nav_breadcrumb
        },
        mounted:function () {
            this.username = this.$route.params.username;
            this.teamid = this.$route.params.teamid;
            if(this.teamid){
                sessionStorage.setItem("teamid", JSON.stringify(this.teamid));
            }else{
                this.teamid = JSON.parse(sessionStorage.getItem("teamid"))
            }

            if(!this.username){
                this.username = Cookies.get("username");
            }
            if(!this.username)this.$router.push({name:"login",});
            this.get_team_info();
            this.get_activities()
        },
        methods:{
            get_team_info(){
                console.log("get team_info");
                axios.get("api/get_team_info", {
                    params:{
                        teamid:this.teamid
                    }
                }).then((res)=>{
                    this.teamname = res.data.result.name;
                    this.members = res.data.result.members;
                    this.historyMessage = res.data.result.historyMessage;
                    this.creator=res.data.result.creator;
                    this.isCreator = (this.username ===res.data.result.creator)
                })
            },
            get_friends(){
                axios.get("api/get_friend_list", {
                    params:{
                        username:this.username
                    }
                }).then((res)=>{
                    this.friends = res.data.result.friends;
                })
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
            show_invite_list(){
                this.get_friends();
                this.inviteDialog=true;

            },
            invite_friends(){
                this.inviteDialog=false;
                for(var i=0;i<this.selectedFriends.length;i++){
                    axios.post("/api/send_team_invitation", {
                        username: this.username,
                        teamid:this.teamid,
                        teamname:this.teamname,
                        player:this.selectedFriends[i]
                    }).then((res)=>{
                        if(res.data.status==="200"){
                            alert("add "+this.selectedFriends[i]+" success!");
                        }else{
                            alert(res.data.message);
                        }
                    })
                }
                alert("send invitation succeeds!")
            },
            show_add_activity(){
              this.addActivityDialog=true;
            },
            close_start_date_picker(){
                this.startDatePickerDialog=false;
                $refs.dialog.save(this.newActivityStartDate);
            },
            add_activities(){
                var beginDate=this.newActivityStartDate+"T"+this.newActivityStartTime+":00";
                var endDate=this.newActivityEndDate+"T"+this.newActivityEndTime+":00";
                if(this.newActivityTitle !==""|| this.newActivityContent!==""){
                axios.post("/api/create_activity", {
                    username: this.username,
                    teamid:this.teamid,
                    title:this.newActivityTitle,
                    content:this.newActivityContent,
                    beginDate:beginDate,
                    endDate:endDate
                }).then((res)=>{
                    if(res.data.status==="200"){
                        alert("add activity success!");
                        this.get_activities()
                    }else{
                        alert(res.data.message);
                    }
                    this.addActivityDialog=false;
                })}
            },
            get_activities(){
                axios.get("/api/get_activities", {
                    params:{
                        teamId:this.teamid
                    }
                }).then((res)=>{
                    var activities=res.data.result.activities;
                    this.activities=[];
                    this.pastActivities=[];
                    for(var i=0;i<activities.length;i++){
                        if(activities[i]['isExpired']===false){
                            this.activities.push(activities[i])
                        }else{
                            this.pastActivities.push(activities[i])
                        }
                    }
                })

            }
        }
    }
</script>

<style scoped>

</style>
