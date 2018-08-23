<template>
    <div>
        <keep-alive include="index">
            <router-view/>
        </keep-alive>
        <notifications group="toast" class="toast" id="toast"/>
    </div>
</template>
<script>
  import { mapState } from 'vuex'
  import EOS from 'eosjs'
  export default{
    data: () => {
      return {}
    },
    computed:{
      ...mapState({
          'lang': 'lang',
      })
    },
    mounted(){
      let lang = this.lang || 'zh'
      this.$i18n.locale = lang
    },
    components: {},
    async created(){
      this.$store.dispatch('getEosPrice')
      setTimeout(() => {
        this.$store.dispatch('getAccount').then(() => {
          this.$store.dispatch('getCurrnRoundInfo')
          this.$store.dispatch('getAccountInfo')
        })
      }, 500)
      setInterval(() => {
        this.$store.dispatch('getCurrnRoundInfo')
        this.$store.dispatch('getAccountInfo')
      }, 1000)

    }
  }
</script>
<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
    }

    #app::-webkit-scrollbar {
        width: 0px;
        -webkit-overflow-scrolling: touch;
    }

</style>
