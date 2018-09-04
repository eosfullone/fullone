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
      return {
        loaded: false,
        sysLang:''
      }
    },
    computed: {
      ...mapState({
        'lang': 'lang',
      })
    },
    mounted(){
      let lang = this.lang || 'en'
      this.$i18n.locale = lang
    },
    components: {},
    async created(){
      this.$store.dispatch('getEosPrice')
      setTimeout(()=>{
        this.$store.dispatch('getAppInfo').then(() => {
          this.loaded = true
        })
      },500)
    },
    methods:{
      changeLang(){
        let lang = this.lang
        if(lang == 'zh'){
          lang = 'en'
        }else{
          lang = 'zh'
        }
        this.$store.dispatch('setLang',{lang})
        this.$i18n.locale = lang
      }
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

    .lang {
        width: 0.63rem;
        height: 0.32rem;
        border: 0.01rem solid #FFFFFF;
        border-radius: 1rem;
        font-family: PingFangSC-Medium;
        font-size: 0.14rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        line-height: 0.32rem;
        position: absolute;
        right: 0.1rem;
        top:0.65rem
    }

</style>
