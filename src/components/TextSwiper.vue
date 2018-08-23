<template>
    <div id="box">
        <ul id="con1" ref="con1" :class="{anim:animate==true}">
            <li v-for='item in items'>{{item}}</li>
        </ul>
    </div>
</template>

<script>

  export default {
    data() {
      return {
        animate: false,
        index: 0
      }
    },
    props: ['items'],
    created(){
      setInterval(this.scroll, 3000)
    },
    methods: {
      scroll(){
        let con1 = this.$refs.con1;
        if (!this.items || !con1) return
        con1.style.marginTop = '-0.18rem';
        this.animate = !this.animate;
        var that = this; 
        setTimeout(function () {
          that.items.push(that.items[0]);
          that.items.shift();
          con1.style.marginTop = "0rem"
          that.animate = !that.animate;  
        }, 500)
      }
    }
  }
</script>

<style>

    #box {
        width: 2rem;
        height: 0.15rem;
        overflow: hidden;
        transition: all 0.5s;
    }

    .anim {
        transition: all 0.5s;
    }
</style>