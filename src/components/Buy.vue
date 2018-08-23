<template>
    <div class="buy" id="buy">
        <BottomModal @close="close" class="step1" closeBtn="true" v-if="showChoose">
            <div slot="header">
                <div class="inviter" id="buy_step1">
                    <div class="inviter_tip"> {{$t('TIP.INVITE_CODE')}}:</div>
                    <div class="inviter_code"><input v-model="aff" v-on:blur="checkInvite"></div>
                </div>
                <div class="buy_title">{{$t('TIP.CHOOSE_TEAM')}}:
                    <div class="team_help_icon" @click="toTeamHelp">
                        <img class="buy_help_icon" src="../assets/imgs/help.png">
                    </div>
                </div>
            </div>
            <div slot="body" class="modal_body">
                <div class="teams">
                    <div class="team" :class="{active:selectIndex==0}" @click="selectTeam(0)">
                        <div class="team_logo">
                            <img src="../assets/imgs/ql_logo.png">
                        </div>
                        <div class="team_name" > {{$t('TEAMS.TEAM1')}}</div>
                    </div>
                    <div class="team" :class="{active:selectIndex==1}" @click="selectTeam(1)">
                        <div class="team_logo" >
                            <img src="../assets/imgs/bh_logo.png">
                        </div>
                        <div class="team_name" > {{$t('TEAMS.TEAM2')}}</div>
                    </div>
                    <div class="team" :class="{active:selectIndex==2}" @click="selectTeam(2)">
                        <div class="team_logo">
                            <img src="../assets/imgs/zq_logo.png">
                        </div>
                        <div class="team_name" > {{$t('TEAMS.TEAM3')}}</div>
                    </div>
                    <div class="team" :class="{active:selectIndex==3}" @click="selectTeam(3)">
                        <div class="team_logo">
                            <img src="../assets/imgs/xw_logo.png">
                        </div>
                        <div class="team_name" > {{$t('TEAMS.TEAM4')}}</div>
                    </div>
                </div>
                <div class="buy_area">
                    <div>{{$t('TIP.BUY_KEY')}}：</div>
                    <div class="count">
                        <div>{{$t('TIP.QUANTITY')}}：</div>
                        <div class="buy_num">
                            <input v-model="buyNum" type="number" placeholder="0">KEY
                        </div>
                    </div>
                    <div class="addBtns">
                        <div @click="addKey(1)">+ 1</div>
                        <div @click="addKey(3)">+ 3</div>
                        <div @click="addKey(10)">+ 10</div>
                        <div @click="addKey(100)">+ 100</div>
                    </div>
                    <div class="price_tip">
                        1 KEY ≈{{keyPrice}} EOS
                    </div>
                    <div class="sum">
                        {{$t('TIP.PAY')}} {{sumPrice}} EOS
                    </div>
                </div>
            </div>
            <div slot="footer" class="confirm">
                <div class="buy_btns">
                    <div class="earning_buy" @click="toConfirm(1)">{{$t('BTN.PROFIT_PAY')}}</div>
                    <div class="wallet_buy" @click="toConfirm(2)">{{$t('BTN.WALLET_PAY')}}</div>
                </div>
                <div class="buy_tip">
                    {{$t('TIP.PAY_TIP')}}
                </div>
            </div>
        </BottomModal>
        <BottomModal @close="close" @back="backToSetp1" class="step2" backBtn="true" closeBtn="true"
                     v-if="showEarningsBuy">
            <div slot="header">
                <div class="confirm_title">{{$t('TIP.PAY')}}</div>
                <div class="confirm_num">{{sumPrice}}EOS</div>
            </div>
            <div slot="body">
                <div class="my_earning">
                    <div class="e_title">{{$t('TIP.MY_PROFITS')}}：</div>
                    <div class="e_val">{{accountInfo.myEarn}} EOS</div>
                </div>
            </div>
            <div slot="footer">
                <div v-if="canOffer" class="confirm_btn" @click="confirm">{{$t('BTN.PAY_CONFIRM')}}</div>
                <div v-if="!canOffer" class="confirm_btn no">{{$t('BTN.UNABLE_PAY')}}</div>
            </div>
        </BottomModal>
        <BottomModal @close="close" class="step2" closeBtn="true" v-if="showWalletBuy">
            <div slot="header" class="title">
                <div>{{$t('TIP.PAY')}}</div>
                <div>{{sumPrice}}OS</div>
            </div>
            <div slot="body">

            </div>
            <div slot="footer" class="confirm">
                <button @click="confirm">{{$t('BTN.CONFIRM')}}</button>
            </div>
        </BottomModal>
    </div>
</template>
<script>
  import { dealVal } from '../utils/utils'
  import BottomModal from './BottomModal.vue'
  import { mapState } from 'vuex'
  export default{
    data: () => {
      return {
        showChoose: true,
        showEarningsBuy: false,
        showWalletBuy: false,
        show: false,
        selectIndex: 0,
        aff: '',
        accounts: [],
        buyNum: '',
        canOffer: false,
      }
    },
    mounted(){
      let aff = window.localStorage.getItem("aff")
      if (aff) {
        this.aff = aff
      }
    },
    watch: {
      buyNum(newNum){
        if (newNum == 0) {
          this.buyNum = ''
        } else if (newNum == '') {
          return
        }else if (newNum <0) {
          this.buyNum = ''
        } else {
          this.buyNum = parseInt(newNum)
        }
      }
    },
    computed: {
      ...mapState({
        'roundInfo': 'roundInfo',
        'accountName': 'accountName',
        'accountInfo': 'accountInfo',
        'lang':'lang'
      }),
      keyPrice(){
        let price = 0
        let roundKes = this.roundInfo.keys || 0
        roundKes++
        price = (1.6 * (roundKes / Math.pow(10, 8)) + 666666) / Math.pow(10, 8)
        price = price.toFixed(4)
        if (isNaN(price)) {
          price = 0
        }
        return price
      },
      sumPrice(){
        return (this.buyNum * this.keyPrice).toFixed(4)
      },
      myKeys(){
        let keys = 0
        if (this.accountInfo.keys && this.accountInfo.round_id == this.roundInfo.round_id) {
          keys = this.accountInfo.keys
        }
        return keys
      }
    },
    components: {
      BottomModal
    },
    methods: {
      toast(text){
        this.$notify({
          group: 'toast',
          text: text,
          duration: 3000
        })
        document.getElementById("toast").setAttribute("style", "")
      },
      close(){
        this.$emit('close')
      },
      toConfirm(type){
        if (!this.buyNum) {
          this.toast(this.$t('TOAST.LEAST_BUY'))
          return
        }
        let isLimit = this.checkLimit()
        if (!isLimit) {
          return this.toast(this.$t('TOAST.LIMIT_TIP'))
        }
        window.localStorage.setItem("aff", this.aff)
        if (type == 2) {
          this.wallterBuy()
          return
        } else {
          this.showChoose = false
          this.showEarningsBuy = true
          if ((this.accountInfo.myEarn - this.sumPrice) >= 0) {
            this.canOffer = true
          } else {
            this.canOffer = false
          }
        }
      },
      async confirm(){
//        this.$emit('close')
        try {
          let param = {team_id: this.selectIndex + 1, tokens: this.sumPrice, aff: this.aff}
          let result = await this.$store.dispatch('buyxtoken', param)
          if (result && result.code == 0) {
            this.toast(this.$t('TOAST.BUY_SUCCESS'))
            this.$emit('close')
          } else if (result && result.message) {
            let message = JSON.parse(result.message)
            if (message && message.data && message.data.message) {
              this.toast(message.data.message)
            } else {
              this.toast(this.$t('TOAST.BUY_FAIL'))
            }
          } else {
            this.toast(this.$t('TOAST.BUY_FAIL'))
          }
        } catch (err) {
          document.body.querySelector('#test').innerHTML = JSON.stringify(err)
        }
      },
      async wallterBuy(){
        try {
          if (!this.buyNum) {
            this.toast(this.$t('TOAST.LEAST_BUY'))
            return
          }
          let isLimit = this.checkLimit()
          if (!isLimit) {
            return this.toast(this.$t('TOAST.LIMIT_TIP'))
          }
          window.localStorage.setItem("aff", this.aff)
          let param = {team_id: this.selectIndex + 1, tokens: this.sumPrice, aff: this.aff}
          let result = await this.$store.dispatch('wallterBuy', param)
          if (result && result.code == 0) {
            this.toast(this.$t('TOAST.BUY_SUCCESS'))
            this.$emit('close')
          } else if (result && result.message) {
//            document.body.querySelector("#test").innerHTML = JSON.stringify(result)
            let message = JSON.parse(result.message)
            if (message && message.data && message.data.message) {
              this.toast(message.data.message)
            } else {
              this.toast(this.$t('TOAST.BUY_FAIL'))
            }
          } else {
            this.toast(this.$t('TOAST.BUY_FAIL'))
          }
        } catch (err) {
          document.body.querySelector('#test').innerHTML = JSON.stringify(err)
        }
      },
      selectTeam(index){
        this.selectIndex = index
      },
      backToSetp1(){
        this.showChoose = true
        this.showEarningsBuy = false
      },
      addKey(val){
        let base = this.buyNum || 0
        this.buyNum = parseInt(parseInt(base) + parseInt(val))
      },
      checkInvite(){
        if (this.aff == "" || /^([a-z]|[1-5]){0,12}$/.test(this.aff)) {
          return true
        } else {
          this.aff = ""
          this.toast(this.$t('TOAST.INVITE_CODE_ERR'))
        }
      }, checkLimit(){
        let limitKeys = 50000
        if (this.roundInfo && this.roundInfo.keys && this.accountInfo && this.roundInfo.round_id==this.accountInfo.round_id) {
          let allKeys = this.dealKeyVal(this.roundInfo.keys)
          let mytokens = 0
          if (this.accountInfo.tokens) {
            mytokens = Math.round(this.accountInfo.tokens / Math.pow(10, 8))
            console.log(mytokens)
            if (isNaN(mytokens)) {
            }
          }
          console.log(parseFloat(mytokens) + parseFloat(this.sumPrice))
          if (allKeys < limitKeys) {
            if (mytokens >= 50 || (parseFloat(mytokens) + parseFloat(this.sumPrice)) >= 50)
              return false
          }
        }
        return true
      },
      dealKeyVal(val){
        return dealVal(val)
      }, toTeamHelp(){
        window.location.href = './full_one_help.html#TEAM'
      }
    }
  }
</script>
<style scoped>
    .buy {
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
    }

    .inviter {
        padding-left: 0.2rem;
    }

    .inviter .inviter_tip {
        font-family: PingFangSC-Medium;
        font-size: 0.16rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .inviter .inviter_code input {
        width: 3.15rem;
        height: 0.5rem;
        padding-left: 0.1rem;
        margin-top: 0.1rem;
        line-height: 0.5rem;
        background: #FFFFFF;
        border-radius: 0.06rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #323232;
        letter-spacing: 0;
    }

    .team_help_icon {
        margin-left: 0.1rem;
        /*border: solid 0.01rem;*/
        width: 0.14rem;
        height: 0.14rem;
        line-height: 0.15rem;
        /*border-radius: 0.2rem;*/
        text-align: center;
        font-size: 0.14rem;
        position: relative;
    }

    .buy_title {
        padding-top: 0.2rem;
        padding-left: 0.2rem;
        font-family: PingFangSC-Medium;
        font-size: 0.16rem;
        color: #FFFFFF;
        letter-spacing: 0;
        display: flex;
        align-items: center;
    }

    .step1 .header {
        margin-top: 1.23rem;
    }

    .step1 .modal-wrapper .modal-container {
        height: 5.12rem;
        overflow-y: scroll;
        position: relative;
    }

    .modal_body {
        padding: 0 0.1rem;
    }

    .teams {
        padding-top: 0.06rem;
        margin-left: 0.28rem;
        width: 3rem;
        display: flex;
        justify-content: space-between;
    }

    .teams .team {
        display: flex;
        flex-direction: column;
        height: 1.12rem;
        text-align: center;
        opacity: 0.5;
    }

    .teams .team.active {
        opacity: 1;
    }

    .teams .team_logo img {
        margin-top: 0.14rem;
        width: 0.48rem;
        height: 0.48rem;
        /*border-radius: 0.5rem;*/
        /*background-color: green;*/
    }

    .teams .team .team_name {
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        padding-top: 0.04rem;
    }

    .buy_area {
        /*display: none;*/
        padding: 0.1rem;
        padding-top: 0rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #FFFFFF;
        letter-spacing: 0;
        width: 3.35rem;
    }

    .buy_area .count {
        display: flex;
        justify-content: space-between;
        background: #FFFFFF;
        border-radius: 0.06rem;
        height: 0.5rem;
        line-height: 0.5rem;
        color: #323232;
        margin: 0.1rem 0;
        padding-left: 0.1rem;
        padding-right: 0.1rem;

    }

    .buy_area .count .buy_num {
        text-align: right;
    }

    .buy_area .count .buy_num input {
        font-family: PingFangSC-Medium;
        font-size: 0.2rem;
        color: #323232;
        letter-spacing: 0;
        text-align: right;
        width: 1.18rem;
        margin-right: 0.1rem;

    }

    .buy_area .addBtns {
        display: flex;
        justify-content: space-between;
    }

    .buy_area .price_tip {
        padding: 0.1rem;
        text-align: right;
        font-size: 0.14rem;
    }

    .addBtns div {
        width: 0.76rem;
        height: 0.4rem;
        line-height: 0.4rem;
        background: #FFFFFF;
        border-radius: 0.06rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #323232;
        letter-spacing: 0;
        text-align: center;
    }

    .buy_area .sum {
        font-family: PingFangSC-Medium;
        font-size: 0.2rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        padding-top: 0.2rem;
    }

    .buy_btns {
        display: flex;
        justify-content: space-between;
        font-family: PingFangSC-Medium;
        font-size: 0.16rem;
        letter-spacing: 0;
        padding: 0.1rem 0.3rem;
    }

    .buy_btns .earning_buy {
        width: 1.47rem;
        height: 0.44rem;
        line-height: 0.44rem;
        text-align: center;
        background: url("../assets/imgs/btn_bg.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #00FFF6;
    }

    .buy_btns .wallet_buy {
        width: 1.47rem;
        height: 0.44rem;
        line-height: 0.44rem;
        text-align: center;
        background-image: linear-gradient(-90deg, #32F8FF 3%, #FC00FF 99%);
        border-radius: 0.06rem;
        color: #250061;
        letter-spacing: 0;
        text-align: center;
    }

    .buy_tip {
        padding: 0rem 0.3rem 0.6rem 0.3rem;
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: justify;
        line-height: 0.16rem;
    }

    .confirm_title {
        padding-top: 0.6rem;
        font-family: PingFangSC-Regular;
        font-size: 0.18rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
    }

    .confirm_num {
        padding-top: 0.08rem;
        font-family: PingFangSC-Medium;
        font-size: 0.4rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
    }

    .my_earning {
        padding: 0.3rem 0.2rem;
        display: flex;
        justify-content: space-between;
        font-family: PingFangSC-Regular;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .my_earning .e_title {
        font-size: 0.16rem;

    }

    .my_earning .e_val {
        font-size: 0.2rem;
    }

    .confirm_btn {
        width: 3.35rem;
        height: 0.5rem;
        line-height: 0.5rem;
        background-image: linear-gradient(-90deg, #32F8FF 3%, #FC00FF 99%);
        border-radius: 0.06rem;
        font-family: PingFangSC-Medium;
        font-size: 0.18rem;
        color: #250061;
        letter-spacing: 0;
        text-align: center;
        margin-left: 0.2rem;
        margin-bottom: 0.6rem;
    }

    .confirm_btn.no {
        opacity: 0.4;
    }

    .buy_help_icon {
        width: 0.15rem;
        height: 0.15rem;
    }
</style>