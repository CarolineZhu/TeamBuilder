<template>
    <main :style="mainStyle">
        <!-- 白星星 -->
        <div class="star_line">
            <span @click="changeValue(star)" class="star" :style="starStyle" v-for="star in total">☆</span>
        </div>
        <!-- 黑星星 -->
        <div class="star_line" :style="blackStyle">
            <span @click="changeValue(star-1)" class="star" :style="starStyle" v-for="star in total">★</span>
        </div>
    </main>

</template>

<script>
    export default {
        name: "star_rate-withDecimal",
        props:{
            total:{
                default:10,
            },
            size:{
                default:30
            },
            value:{},
        },
        data(){
            return{
                score:1
            }
        },
        computed:{
            mainStyle(){
                return{
                    width:this.size * this.total + "px",
                }
            },
            starStyle(){
                return{
                    width:this.size + "px",
                    height:this.size + "px",
                    fontSize: this.size + 6 + "px"
                }
            },
            blackStyle(){
                return{
                    width:this.value / this.total * 100 + "%"
                }
            }
        },
        methods:{
            changeValue(value){
                this.$emit("input",value)
            }
        }
    }
</script>

<style scoped>
    main{
        position:relative;
    }
    .star_line{
        width-space: nowrap;
        overflow: hidden;
        position: absolute;
    }
    .star{
        display: inline-block;
        cursor: pointer
    }
</style>