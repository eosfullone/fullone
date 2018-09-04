<template>
    <div class="earning" :class="gameClass">
        <div class="back" :class="{ios:isIOS}">
            <div class="back_btn" @click="back">
                <img src="../../public/static/imgs/back.png">
            </div>
        </div>
        <div class="header">
            <div>&nbsp;</div>
            <div class="header_btn right" :class="{en:lang=='en'}" @click="toInvite">{{$t('BTN.INVITE')}}</div>
        </div>
        <div class="earning_title">
            {{$t('TIP.MY_PROFITS')}}
        </div>
        <div class="earning_main">
            <div class="earning_val">
                {{accountInfo.myEarn}} <br>EOS
            </div>
        </div>
        <div class="with_draw_btn_bg" @click="withdraw">
            <div class="with_draw_btn">{{$t('BTN.WITHDRAW_NOW')}}</div>
        </div>

        <div class="earning_detail">
            <div class="info_item">
                <div class="info_name">
                    <span>{{$t('TIP.GAMEPROFITS')}}：</span>
                </div>
                <div class="info_value">
                    <div class="value">{{earnGame}} EOS</div>
                    <div class="about_value">≈ {{dealCurrency(earnGame)}} {{currency}}</div>
                </div>
            </div>
            <div class="info_item">
                <div class="info_name">{{$t('TIP.INVITATIONPROFITS')}}:</div>
                <div class="info_value">
                    <div class="value">{{earnAff}} EOS</div>
                    <div class="about_value">≈ {{dealCurrency(earnAff)}} {{currency}}</div>
                </div>
            </div>
            <div class="info_item opt">
                <div class="info_name">
                    <span>{{$t('TIP.EXPECTEDPROFITS')}}：</span>
                </div>
                <div class="info_value">
                    <div class="value">{{earnPool}} EOS</div>
                    <div class="about_value">≈ {{dealCurrency(earnPool)}} {{currency}}</div>
                </div>
            </div>
        </div>

        <BottomModal @close="showWithDraw = false" class="step2" closeBtn="true" v-if="showWithDraw">
            <div slot="header">

            </div>
            <div slot="body">
                <div class="with_draw_info">
                    <div class="with_draw_item">
                        <div class="item_title">{{$t('TIP.WITHDRAW')}}：</div>
                        <div class="item_val">{{accountInfo.myEarn}} EOS</div>
                    </div>
                    <div class="with_draw_item">
                        <div class="item_title">{{$t('TIP.WITHDRAW_ACCOUNT')}}：</div>
                        <div class="item_val">{{accountName}}</div>
                    </div>
                </div>

            </div>
            <div slot="footer">
                <div class="confirm_btn" @click="confirm">{{$t('BTN.WITHDRAW_CONFIRM')}}</div>
            </div>
        </BottomModal>
    </div>
</template>
<script>
  import BottomModal from '../components/BottomModal.vue'
  import { dealVal } from '../utils/utils'
  import { mapState } from 'vuex'
  export default{
    data: () => {
      return {
        showWithDraw: false,
      }
    },
    mounted(){
//      this.$store.dispatch('getMyActions')
    },
    computed: {
      ...mapState({
        'accountInfo': 'accountInfo',
        'roundInfo': 'roundInfo',
        'eosPrice': 'eosPrice',
        'accountName': 'accountName',
        'rate': 'rate',
        'currency': 'currency',
        'lang': 'lang',
        'isIOS':'isIOS',
        'styleModel':'styleModel'
      }),
      gameClass(){
        let obj ={}
        obj[`gameModel${this.styleModel}`] = true
        return obj
      },
      earnAff(){
        let val = 0
        if (this.accountInfo && this.accountInfo.earn_aff) {
          val = dealVal(this.accountInfo.earn_aff)
        }
        return val
      },

      earnGen(){
        let val = 0
        if (this.accountInfo && this.accountInfo.earn_gen) {
          val = dealVal(this.accountInfo.earn_gen)
        }
        return val
      },

      earnWin(){
        let val = 0
        if (this.accountInfo && this.accountInfo.earn_win) {
          val = dealVal(this.accountInfo.earn_win)
        }
        return val
      },

      earnPool(){
        let teamRatMap = [0.2, 0.3, 0.15, 0.25]
        let val = 0
        if (this.roundInfo && this.roundInfo.lead_team) {
          let team_id = this.roundInfo.lead_team - 1
          let pot = dealVal(this.roundInfo.pot)
          let mykeys = this.accountInfo.keys
          let sumkeys = this.roundInfo.keys
          if (pot && mykeys && sumkeys) {
            let teamRat = teamRatMap[team_id]
            let rat = mykeys / sumkeys
            val = pot * rat * teamRat
            if (this.accountName == this.roundInfo.lead_player) {
              val = val + pot * 0.48
            }
            val = val.toFixed(4)
            if (isNaN(val)) {
              val = 0
            }
          }
        }
        return val
      },

      earnGame(){
        let val = 0
        val = parseFloat(this.earnGen) + parseFloat(this.earnWin)
        return val
      },

    },
    components: {
      BottomModal
    },
    methods: {
      toast(text){
        this.$notify({
          group: 'toast',
          text: text,
          duration: 5000
        })
        document.getElementById("toast").setAttribute("style", "")
      },
      async confirm(){
        try {
          let result = await this.$store.dispatch('withdraw')
          if (result && result.code == 0) {
            this.toast(this.$t('TOAST.WITHDRAW_SUCCESS'))
            this.showWithDraw = false
          } else if (result && result.message) {
            let message = JSON.parse(result.message)
            if (message && message.data && message.data.message) {
              this.toast(message.data.message)
            } else {
              this.toast(this.$t('TOAST.WITHDRAW_FAIL'))
            }
          } else {
            this.toast(this.$t('TOAST.WITHDRAW_FAIL'))
          }
        } catch (err) {
          this.toast(result.data.message)
        }

//        this.showWithDraw = false
      },
      withdraw(){
        if (!this.accountInfo || !this.accountInfo.myEarn) {
          return this.toast(this.$t('TOAST.UNABLE_WITHDRAW'))
        }
        this.showWithDraw = true
      },
      dealCurrency(val){
        let result = 0
        if (this.eosPrice && val) {
          result = this.eosPrice * val
          if (this.rate) {
            result = result * this.rate
          }
          result = result.toFixed(4)
        }
        return result
      },
      back(){
        this.$router.push('index')
      },
      toInvite(){
        this.$router.push('invite')
      }
    }
  }
</script>
<style scoped>
    .earning {
        background: #2c34ac;
        height: 100%;
    }
    .gameModel1.earning {
        background: url("../../public/static/imgs/earning_bg_1.png");
        background-size: 100%;
    }
    .earning_title {
        padding-left: 0.2rem;
        font-family: PingFangSC-Medium;
        font-size: 0.3rem;
        color: #00FFF6;
        letter-spacing: 0;
    }
    .gameModel1 .earning_title{
        color:#ffc659;
    }
    .earning_main {
        margin-left: 0.1rem;
        /*margin-top: 0.2rem;*/
        width: 2.95rem;
        height: 1.1rem;
        padding: 0.2rem;
        padding-bottom: 0;
        /*border-radius: 0.12rem;*/
        /*background: url("../../public/static/imgs/withdraw_info_bg.png");*/
        /*background-size: 100% 100%;*/
        /*background-repeat: no-repeat;*/
    }

    .earning_main .earning_val {
        font-family: PingFangSC-Medium;
        font-size: 0.36rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .earning_main .earning_usdt_val {
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .with_draw_btn_bg {
        width: 2.07rem;
        height: 0.44rem;
        margin: 0.2rem auto 0.2rem auto;
        background: url("../../public/static/imgs/btn_bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .gameModel1 .with_draw_btn_bg{
        width: 2.4rem;
        height: 0.6rem;
        background: url("../../public/static/imgs/withdraw_btn_bg_1.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .with_draw_btn {
        margin: 0.02rem;
        background: rgba(255, 62, 229, 0.13);
        border-radius: 0.06rem;
        line-height: 0.44rem;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 0.16rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
    }
    .gameModel1 .with_draw_btn{
        line-height: 0.6rem;
        background: none;
    }
    .earning_detail {
        margin: 0.5rem auto 0.8rem auto;
        width: 2.95rem;
        height: 2.04rem;
        padding: 0.12rem 0.2rem 0.2rem 0.2rem;
        /*background: #FFFFFF;*/
        border-radius: 0.12rem;
        color: #FFFFFF;
        background: url("../../public/static/imgs/earning_bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .gameModel1 .earning_detail{
        background: none;
        border: #532d32 solid 0.02rem;
    }
    .earning_detail .info_item {
        display: flex;
        justify-content: space-between;
        padding-top: 0.2rem;

    }

    .earning_detail .info_item.opt {
        opacity: 0.4;
    }

    .earning_detail .info_name {
        display: flex;
        align-items: flex-start;
        width: 0.8rem;
    }

    .earning_detail .info_item .info_icon img {
        width: 0.2rem;
    }

    .earning_detail .info_value {
        display: flex;
        flex-direction: column;
        text-align: right;
        font-family: PingFangSC-Medium;
        letter-spacing: 0;
        text-align: right;
    }

    .earning_detail .info_value .value {
        font-size: 0.2rem;
        color: #FFFFFF;
    }

    .earning_detail .info_value .about_value {
        opacity: 0.8;
        font-family: PingFangSC-Regular;
        font-size: 0.14rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: right;
    }

    .earning_detail .with_draw_item {
        padding: 0.3rem 0.2rem;
        display: flex;
        justify-content: space-between;
        font-family: PingFangSC-Regular;
        color: #FFFFFF;
        letter-spacing: 0;
    }


</style>