<template>
    <div id="app" style="margin-top: 0">
        <div style="align-content: center">
            <div class="grade-box">
                <img v-for="(value,index) in stars" v-bind:src="index < starNum ? starOnImg:starOffImg" alt="star" />
            </div>
        </div>
    </div>
</template>

<script>
    import starOff from "../assets/starOff.png"
    import starOn from "../assets/starOn.png"

    export default {
        name: "star_rate_fixed",
        props: ["starNum"],
        data(){
            return{
                starOffImg: starOff,
                starOnImg : starOn,
                stars:[1,2,3,4,5]
            }
        },
    }
</script>