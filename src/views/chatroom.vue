<template>
        <div>
            <Chat id="chatroom"
                    :participants="participants"
                    :myself="myself"
                    :messages="messages"
                    :onType="onType"
                    :onMessageSubmit="onMessageSubmit"
                    :chatTitle="chatTitle"
                    :placeholder="placeholder"
                    :colors="colors"
                    :borderStyle="borderStyle"
                    :hideCloseButton="hideCloseButton"
                    :closeButtonIconSize="closeButtonIconSize"
                    :submitIconSize="submitIconSize"/>
        </div>
</template>

<script>
    import {Chat} from 'vue-quick-chat';
    import 'vue-quick-chat/dist/vue-quick-chat.css';

    export default {
        components: {
            Chat
        },
        data() {
            return {
                visible: true,
                participants: [
                    {
                        name: 'Arnaldo',
                        id: 1
                    },
                    {
                        name: 'José',
                        id: 2
                    }
                ],
                myself: {
                    name: 'Matheus S.',
                    id: 3
                },
                messages: [
                    {
                        content: 'received messages',
                        myself: false,
                        participantId: 1,
                        timestamp: {year: 2019, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123}
                    },
                    {
                        content: 'sent messages',
                        myself: true,
                        participantId: 3,
                        timestamp: {year: 2019, month: 4, day: 5, hour: 19, minute: 10, second: 3, millisecond: 123}
                    },
                    {
                        content: 'other received messages',
                        myself: false,
                        participantId: 2,
                        timestamp: {year: 2019, month: 5, day: 5, hour: 10, minute: 10, second: 3, millisecond: 123}
                    }
                ],
                chatTitle: 'My chat title',
                placeholder: 'send your message',
                colors: {
                    header: {
                        bg: '#0a0406',
                        text: '#fff'
                    },
                    message: {
                        myself: {
                            bg: '#fff',
                            text: '#0a0406'
                        },
                        others: {
                            bg: '#509bff',
                            text: '#fff'
                        },
                        messagesDisplay: {
                            bg: '#f7f3f3'
                        }
                    },
                    submitIcon: '#0a0406'
                },
                borderStyle: {
                    topLeft: "10px",
                    topRight: "10px",
                    bottomLeft: "10px",
                    bottomRight: "10px",
                },
                hideCloseButton: false,
                submitIconSize: "30px",
                closeButtonIconSize: "20px",
                asyncMode: false,
                toLoad: [
                    {
                        content: 'Hey, John Doe! How are you today?',
                        myself: false,
                        participantId: 2,
                        timestamp: {year: 2011, month: 3, day: 5, hour: 10, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    },
                    {
                        content: "Hey, Adam! I'm feeling really fine this evening.",
                        myself: true,
                        participantId: 3,
                        timestamp: {year: 2010, month: 0, day: 5, hour: 19, minute: 10, second: 3, millisecond: 123},
                        uploaded: true,
                        viewed: true
                    },
                ]
            }
        },
        methods: {
            onType: function (event) {
                //here you can set any behavior
            },
            loadMoreMessages(resolve) {
                setTimeout(() => {
                    resolve(this.toLoad); //We end the loading state and add the messages
                    //Make sure the loaded messages are also added to our local messages copy or they will be lost
                    this.messages.unshift(...this.toLoad);
                    this.toLoad = [];
                }, 1000);
            },
            onMessageSubmit: function (message) {
                /*
                * example simulating an upload callback.
                * It's important to notice that even when your message wasn't send
                * yet to the server you have to add the message into the array
                */
                this.messages.push(message);
                this.$nextTick(() => {
                    window.scrollTo(0, document.documentElement.clientHeight);
                });

                /*
                * you can update message state after the server response
                */
                // timeout simulating the request
                setTimeout(() => {
                    message.uploaded = true
                }, 2000)
            },
            onClose() {
                this.visible = false;
            }
        }
    }
</script>
