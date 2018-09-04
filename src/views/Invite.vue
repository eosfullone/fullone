<template>
    <div class="invite">
        <div class="header">
            <div class="back" :class="{ios:isIOS}">
                <div class="back_btn" @click="back">
                    <img src="../../public/static/imgs/back.png">
                </div>
            </div>
        </div>
        <div class="invite_main" :class="{en:lang=='en'}">
            <div class="invite_img">
                <img :src="getImgUrl()">
            </div>
            <div class="invite_tip">{{$t('TIP.INVITE_TIP')}}</div>
            <div class="code_title">{{$t('TIP.MY_INVITE_CODE')}}：</div>
            <div class="code_val" id="copyBtn" :data-clipboard-text="accountName" @click="copy">
                <span id="content">{{accountName}}</span>
                <img src="../../public/static/imgs/copy.png">
            </div>
            <div class="share_btns">
                <div class="share_btn" @click="share">{{$t('BTN.SHARE')}} </div>
            </div>
        </div>
    </div>
</template>
<script>
  import ClipboardJS from 'clipboard'
  import config from '../config.js'
  import { mapState } from 'vuex'

  export default{
    data: () => {
      return {
        showGenCode: true,
        showInvite: false
      }
    },
    mounted(){
    },
    computed: {
      ...mapState({
        'accountName': 'accountName',
        'inApp':'inApp',
        'lang':'lang',
        'isIOS':'isIOS'
      })
    },
    components: {},
    methods: {
      confirm(){

      },
      toast(text){
        this.$notify({
          group: 'toast',
          text: text,
          duration: 1000
        })
        document.getElementById("toast").setAttribute("style", "")
      },
      share(){
        //todo
      },
      back(){
        this.$router.go(-1)
      },
      getImgUrl(){
        //todo
      }, copy(){
        new ClipboardJS('#copyBtn')
        this.toast(this.$t('TOAST.COPYED'))
      }
    }
  }
</script>
<style scoped>
    .invite {
        background: #0a0e1d;
        background-image: linear-gradient(#040000, #1a3269);
        width: 100%;
        height: 100%;
    }

    .invite_title {
        padding-left: 0.2rem;
        font-family: PingFangSC-Medium;
        font-size: 0.3rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .invite_main {
        margin:1.4rem auto 0.4rem auto;
        padding: 0.2rem;
        width: 2.95rem;
        border-radius: 0.12rem;
        border: solid 0.02rem #3a4bdd;
    }

    .invite_main .code_title {
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #FFFFFF;
        letter-spacing: 0;
        padding-top: 0.1rem;
    }

    .invite_main .code_val {
        font-family: PingFangSC-Medium;
        font-size: 0.18rem;
        color: #FFFFFF;
        letter-spacing: 0;
        padding-top: 0.11rem;
    }

    .invite_main .code_val img {
        margin-left: 0.07rem;
        width: 0.13rem;
        height: 0.15rem;
    }

    .invite_main .code_line {
        background: #FFFFFF;
        height: 0.01rem;
        border: none;
        margin-top: 0.2rem;
    }

    .invite_main .invite_tip {
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #FFFFFF;
        letter-spacing: 0;
        padding: 0.1rem 0;
    }

    .invite_main .invite_img {
        margin: -1.51rem auto 0 auto;
        width: 1.94rem;
        height: 2.63rem;
        border-radius: 0.06rem;
        border: solid 0.02rem #3a4bdd;
        overflow: hidden;
    }

    .invite_main .invite_img img {
        width: 1.94rem;
    }

    .invite_main .gradient_div {
        display: block;
        width: 1.94rem;
        height: 0.63rem;
        position: relative;
        margin: 0 auto;
        margin-top: -0.69rem;
        background-image: linear-gradient(-180deg, rgba(83, 120, 251, 0.00) 0%, #2C1063 100%);
    }

    .invite_main .share_btns {
        display: flex;
        justify-content: space-around;
        height: 0.5rem;
        padding: 0.3rem 0rem 0.2rem 0rem;
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        margin-bottom: 0.1rem;

    }

    .invite_main .share_btns img {
        width: 0.5rem;
        height: 0.5rem;
    }
    .share_btn {
        width: 100%;
        height: 0.44rem;
        line-height: 0.44rem;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 0.18rem;
        background: #3a4bdd;
        border-radius: 0.06rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
    }

</style>