<template>
<div id="app" style="margin-top: 0">
        <div style="align-content: center">
            <div class="grade-box">
                <img v-for="(star,index) in stars" v-bind:src="star.src" v-on:click="rating(index, typeIndex)" alt="star" />
            </div>
        </div>
    </div>
</template>

<script>
    import starOff from "../assets/starOff.png"
    import starOn from "../assets/starOn.png"

    export default {
        name: "star_rate",
        props: ["typeIndex"],
        data(){
            return{
                stars: [{
                    src: starOff,
                    active: false
                }, {
                    src: starOff,
                    active: false
                }, {
                    src: starOff,
                    active: false
                },
                    {
                        src: starOff,
                        active: false
                    }, {
                        src: starOff,
                        active: false
                    }
                ],
                starNum: 1,
            }
        },
        methods: {
            rating(index, typeIndex) {
                var total = this.stars.length;
                var idx = index + 1;

                if(this.starNum === 0) {
                    this.starNum = idx;
                    for(var i = 0; i < idx; i++) {
                        this.stars[i].src = starOn;
                        this.stars[i].active = true;
                    }
                } else {
                    if(idx === this.starNum) {
                        for(var i = index; i < total; i++) {
                            this.stars[i].src = starOff;
                            this.stars[i].active = false;
                        }
                    }
                    if(idx < this.starNum) {
                        for(var i = idx; i < this.starNum; i++) {
                            this.stars[i].src = starOff;
                            this.stars[i].active = false;
                        }
                    }
                    if(idx > this.starNum) {
                        for(var i = 0; i < idx; i++) {
                            this.stars[i].src = starOn;
                            this.stars[i].active = true;
                        }
                    }

                    var count = 0;
                    for(var i = 0; i < total; i++) {
                        if(this.stars[i].active) {
                            count++;
                        }
                    }
                    this.starNum = count;
                }
                this.$emit("changeRate", {typeIndex: typeIndex, starNum: this.starNum})

            },
        }
    }
</script>

