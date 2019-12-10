<template>
    <div class="hello">
        <v-card height="500">
            <v-app-bar
                    dark
                    color="dark"
            >
                <v-toolbar-title>Chatroom</v-toolbar-title>
            </v-app-bar>

        <div class="chat-wrap" id="chat_box">
            <!--<v-sheet height="400">-->
            <div class="chat-con clearfix" id="chat_con">
                <template v-for="item in historyMessage.concat(messages)">
                    <!-- {{item | json}} -->
                    <template>
                        <div class="chat-item item-right clearfix" v-if="username === item.username "><span class="img fr"></span><span class="message fr">{{item['message']}}</span></div>
                        <div class="chat-item item-left clearfix rela" v-else><span class="abs uname">{{item.username}}  ( {{item.time}} )</span><span class="img fl"></span><span class="fl message">{{item.message}}</span></div>
                    </template>
                </template>
            </div>
            <!--</v-sheet>-->

        </div>
        </v-card>
        <v-card height="80px">
            <v-layout row wrap>
                <v-flex xs9>
                    <v-text-field
                            solo
                            v-model="newMessage"
                            label="send message"
                            style="padding-left: 10px"
                    ></v-text-field>
                </v-flex>
                <v-flex xs3 style="padding-top:18px; padding-left:0px">
                    <v-btn text color="blue" @click="sendMessage" >Send</v-btn>
                </v-flex>
            </v-layout>
        </v-card>
    </div>
</template>

<script >
    import 'vue-quick-chat/dist/vue-quick-chat.css';
    import io from 'socket.io-client';
    import axios from 'axios';
    import Cookies from 'js-cookie'



    export default {
        props:["historyMessage"],
        components: {
        },
        data() {
            return {
                username:"",
                teamid:"",
                visible: true,
                newMessage:"",
                g_socket:io('http://localhost:4001', { query: 'name='+this.username}),
                participantsString:[],
                myself: {
                    name:"",
                    id:""
                },
                messages: [
                ],
                chatTitle: 'My chat title',
                placeholder: 'send your message',
            }
        },
        created:function(){
        },
        mounted:function () {
            this.username = this.$route.params.username;
            this.teamid = this.$route.params.teamid;
            if(!this.teamid){
                this.teamid = JSON.parse(sessionStorage.getItem("teamid"))
            }
            if(!this.username){
                this.username = Cookies.get("username");
            }
            this.connectSocket();
            this.messages=this.messages.concat(this.historyMessage);

        },
        methods: {
            onType: function (event) {
            },
            sendMessage(){
                var newMessage = {
                    message:this.newMessage,
                    username:this.username,
                    time:new Date().toString().substring(0,25),
                    room:this.teamid
                };
                this.g_socket.emit('text', newMessage);
                this.messages.push(newMessage);



                this.$nextTick(() => {
                    let msg = document.getElementById('chat_box');
                    msg.scrollTop = msg.scrollHeight;
                });
                axios.post("api/send_message",{
                    message:this.newMessage,
                    username:this.username,
                    teamid:this.teamid
                }).then((res)=>{
                    this.newMessage="";
                })
            },
            onNewMember(member){
            },
            onMessageReceive(data){
                if(data['username']!==this.username) {
                    this.messages.push(data);
                    this.$nextTick(() => {
                        let msg = document.getElementById('chat_box');
                        msg.scrollTop = msg.scrollHeight;
                    });
                }

            },
            onClose() {
                this.visible = false;
            },
            connectSocket(){
                console.log("connectSocket");
                // Add a connect listener
                this.g_socket.on('connect', ()=>{
                    this.g_socket.emit('create', this.teamid);
                });
                this.g_socket.on('new member',  (data)=> {
                    // console.log(data);
                    this.onNewMember(data);
                });
                // // Disconnect.
                // // socket.on('ready', function (){
                // //     socket.close();
                // // });
                this.g_socket.on('new message',  (data)=>{
                    console.log(data);
                    this.onMessageReceive(data)
                });
                // this.g_socket.on('user disconnected',  (name)=> {
                //     console.log(name + ' is disconnected.');
                // });
            }
        }
    }
</script>
<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
    *{padding:0; margin:0;}
    html,body{width:100%;height: 100%;}
    .clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
    .clearfix{*zoom:1}
    .cred{color:#f03e3e;}
    .cgreen{color: #509bff;}
    .hide{display:none;}
    .fr{float:right;}
    .fl{float: left;}
    .rela{position: relative;}
    .abs{position:absolute;}
    h1{position: fixed; z-index:20; width: 100%; height:50px; line-height:50px; font-size:20px; left: 0; top: 0; background: #000; color: #fff;}

    /*登录界面*/
    .login-wrap{background:#e7e7e7;width:100%;height:100%; text-align:center;}
    .login-con{padding-top: 50px;}
    .login-con h3{margin-bottom: 20px;}
    .login-con input{width:60%; display:block; margin:0 auto; height: 40px; line-height: 40px; margin-bottom: 20px;}
    .login-con button{width:60%;display:block; margin:0 auto; height: 40px; line-height:40px; border:none; background:#459d36; color:#fff; border-radius:5px;}

    /*聊天界面*/
    .chat-wrap{width: 100%; height: 440px;overflow-y:auto; background:#e7e7e7; text-align:center;}
    .chat-con{padding: 50px 0 70px; background:#e7e7e7; height:500px}
    .chat-con p{display:inline-block; padding:5px 10px; background:#999;border-radius:5px; color:#fff; margin:5px 0;}
    .bottom{position:fixed;bottom:0; left: 0; width:100%; height: 50px; background: #fff;}
    .bottom input{width: 78%; height: 50px; line-height: 50px; float:left;border:none;}
    .bottom button{width: 20%;height: 50px; float: right; border:none; background: #509bff;color: #fff;}
    .chat-item{width:100%; margin-top:20px;}
    .item-right .message{background: #509bff;position: relative;}
    .item-left .message{background: #fff; margin-top:20px; position: relative;}
    .item-left .img{margin-right:10px;}
    .item-left .uname{font-size:12px; left:20px; top:0;}
    .chat-item .message{max-width:60%;display:block; padding:10px;border-radius:5px; margin-right:10px; text-align: justify;}
    .chat-item .img{display:inline-block; width:10px; height:10px; background-size:100% 100%;}

    .item-right .message::after {
        content: "";
        position: absolute;
        width: 0px;
        height: 0px;
        right: -14px;
        top: 7px;
        border-width: 8px;
        border-style: solid;
        border-color: transparent transparent transparent rgb(80, 155, 255);
        border-image: initial;
    }
    .item-left .message::before {
        content: "";
        position: absolute;
        width: 0px;
        height: 0px;
        left: -13px;
        top: 6px;
        border-width: 8px;
        border-style: solid;
        border-color: transparent rgb(255, 255, 255) transparent transparent;
        border-image: initial;
    }

</style>