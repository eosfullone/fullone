<template>
    <div class="index" :class="gameClass">
        <div class="back" :class="{ios:isIOS}" @click="back">
            <div class="back_btn">
                <img src="../../public/static/imgs/back.png">
            </div>
        </div>
        <div class="header">
            <div class="header_btn left" :class="{en:lang=='en'}" @click="toRule">{{$t('BTN.RULE')}}</div>
            <div class="header_btn right" :class="{en:lang=='en'}" @click="toInvite">{{$t('BTN.INVITE')}}</div>
        </div>
        <div class="top">
            <div class="title_bg">
                <img :src="titleImg">
            </div>
            <div class="pond" v-if="roundState==1 && leftTime>0">
                <div class="pond_icon">
                    <img :src="headerIcon">
                </div>
                <div class="pond_sum" :style="{fontSize:porFontSize+'rem'}">
                    {{potVal}}
                </div>
            </div>

            <div v-if="roundState==1 && leftTime>0">
                <div class="time_out">
                    {{$t('TIP.OVER_TIME')}} {{roundInfo.round_id}} {{$t('TIP.OVER_TIME_TIP')}} -&nbsp;
                    <div class="time">{{leftTimeStr}}</div>
                </div>
                <div class="game_model">
                    {{modelStr}} {{$t('TIP.MODEL_TIP')}}
                </div>
                <div class="top_buy_btn" :class="{en:lang=='en'}" @click="toBuy"></div>
            </div>

            <div v-if="roundState==1 && leftTime==0">

                <div class="time_out">
                    <p v-if="loading" class="loading">
                        loading...
                    </p>
                    <p v-if="!loading">
                        ROUND {{roundInfo.round_id}} {{$t('TIP.OVER')}}<br>
                        {{$t('TIP.NEXT_ROUND')}}
                    </p>

                    <!--<div class="time">{{leftTimeStr}}</div>-->
                </div>
                <div class="game_model">
                    {{modelStr}} {{$t('TIP.MODEL_TIP')}}
                </div>
                <div class="waiting_btn" :class="{en:lang=='en'}"></div>
            </div>
            <div v-if="roundState==2">
                <div class="time_out_wait">
                    {{$t('TIP.BEFOR')}} ROUND {{roundInfo.round_id}} {{$t('TIP.BEGIN')}}<br>
                    <div class="time">{{leftTimeStr}}</div>
                </div>
                <div class="game_model">
                    {{modelStr}} {{$t('TIP.MODEL_TIP')}}
                </div>
                <div class="waiting_btn" :class="{en:lang=='en'}"></div>
            </div>

        </div>
        <div class="broadcast">
            <div class="broadcast_icon">
                <img :src="broadcastIcon">
            </div>
            <div>
                <!--<TextSwiper :items="broadcast"></TextSwiper>-->
                <span> {{broadcastStr}} </span>
            </div>
        </div>
        <div class="main">
            <div class="my_info">
                <div class="info_item">
                    <div class="info_name">
                        <div class="info_icon">
                            <img :src="pondIcon">
                        </div>
                        <span :class="{en:lang=='en'}"> {{$t('TIP.ACTIVE_POT')}}：</span>
                    </div>
                    <div class="info_value">
                        <div class="value">{{potVal}} EOS</div>
                        <div class="about_value">≈ {{dealCurrency(potVal)}} {{currency}}</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="info_name">
                        <div class="info_icon">
                            <img :src="keyIcon">
                        </div>
                        <span :class="{en:lang=='en'}">{{$t('TIP.MY_KEY')}}：</span>
                    </div>
                    <div class="info_value">
                        <div class="value">{{dealKeyVal(myKeys)}} KEY</div>
                        <div class="about_value">{{$t('TIP.GLOBAL')}}: {{dealKeyVal(this.roundInfo.keys)}} KEY</div>
                    </div>
                </div>
                <div class="info_item">
                    <div class="info_name">
                        <div class="info_icon">
                            <img :src="earningIcon">
                        </div>
                        <span :class="{en:lang=='en'}">{{$t('TIP.MY_PROFITS')}}：</span>
                    </div>
                    <div class="info_value">
                        <div class="value">{{accountInfo.myEarn}} EOS</div>
                        <div class="about_value">≈ {{dealCurrency(accountInfo.myEarn)}} {{currency}}</div>
                    </div>
                </div>
                <div class="withdraw_btn" @click="toWithdraw">
                    <div>{{$t('BTN.WITHDRAW_NOW')}}</div>
                </div>
            </div>
            <div class="tabs" :class="{change:tabIndex==1}">
                <div class="tab_nav">
                    <div class="nav_btn" :class="{active:tabIndex==0}" @click="changeTab(0)">{{$t('BTN.MARKET_DAT')}}
                    </div>
                    <div class="nav_btn" :class="{active:tabIndex==1}" @click="changeTab(1)">{{$t('BTN.TEAMS')}}</div>
                </div>

                <div class="tab_main">
                    <div class="market_info" v-if="tabIndex==0">

                        <div class="info_item">
                            <div class="info_name">
                                <span>{{$t('TIP.CURR_ROUND_FUNDS')}}</span>
                            </div>
                            <div class="info_value">
                                <div class="value">{{tokenVal}} EOS</div>
                                <div class="about_value">≈ {{dealCurrency(tokenVal)}} {{currency}}</div>
                            </div>
                        </div>
                        <div class="info_item">
                            <div class="info_name">
                                <span>{{$t('TIP.SENT_REWARDS')}}</span>
                            </div>
                            <div class="info_value">
                                <div class="value">{{grantedVal}} EOS</div>
                                <div class="about_value">≈ {{dealCurrency(grantedVal)}} {{currency}}</div>
                            </div>
                        </div>
                        <div class="info_item">
                            <div class="info_name">{{$t('TIP.SUM_TIME')}}</div>
                            <div class="info_value">
                                <div class="value"> {{totalTime.year}} {{$t('TIP.YEAR')}}</div>
                                <div class="about_value">{{totalTime.second}} {{$t('TIP.SECOND')}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="team_info" v-if="tabIndex==1">
                        <div class="team_item">
                            <div class="item_left">
                                <div class="team_logo">
                                    <img src="../../public/static/imgs/ql_logo.png">
                                </div>
                                <div class="team_name" :class="{en:lang=='en'}">
                                    {{$t('TEAMS.TEAM1')}}
                                </div>
                            </div>
                            <div class="team_value">
                                {{dealKeyVal(roundInfo.team_stat_1)}} EOS
                            </div>
                        </div>
                        <div class="team_item">
                            <div class="item_left">
                                <div class="team_logo">
                                    <img src="../../public/static/imgs/bh_logo.png">
                                </div>
                                <div class="team_name" :class="{en:lang=='en'}">
                                    {{$t('TEAMS.TEAM2')}}
                                </div>
                            </div>
                            <div class="team_value">
                                {{dealKeyVal(roundInfo.team_stat_2)}} EOS
                            </div>
                        </div>
                        <div class="team_item">
                            <div class="item_left">
                                <div class="team_logo">
                                    <img src="../../public/static/imgs/zq_logo.png">
                                </div>
                                <div class="team_name" :class="{en:lang=='en'}">
                                    {{$t('TEAMS.TEAM3')}}
                                </div>
                            </div>
                            <div class="team_value">
                                {{dealKeyVal(roundInfo.team_stat_3)}} EOS
                            </div>
                        </div>
                        <div class="team_item">
                            <div class="item_left">
                                <div class="team_logo">
                                    <img src="../../public/static/imgs/xw_logo.png">
                                </div>
                                <div class="team_name" :class="{en:lang=='en'}">
                                    {{$t('TEAMS.TEAM4')}}
                                </div>
                            </div>
                            <div class="team_value">
                                {{dealKeyVal(roundInfo.team_stat_4)}} EOS
                            </div>
                        </div>
                        <div class="team_help">
                            {{$t('TIP.TEAM_DS')}}
                            <div @click="toTeamHelp">
                                <img class="help_icon"
                                     src="../../public/static/imgs/help.png">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <Bind v-if="showBind" @close="showBind=false"></Bind>
        <NoWallet v-if="showWallet" @close="showWallet=false"></NoWallet>
        <Buy v-if="showBuy" @close="showBuy=false" class="buy-comp"></Buy>
        <Modal @close="showNoInstalled=false" class="step1" closeBtn="true" v-if="showNoInstalled">
            <div slot="header" class="title">
                <div class="noinstall_title" v-html="$t('TIP.NOINSTALL_TITLE')"></div>
            </div>
            <div slot="body"></div>
            <div slot="footer" class="confirm">
                <div class="install_btn" @click="toInstall">{{$t('BTN.NOT_INSTALL')}}</div>
            </div>
        </Modal>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getQueryStr, dealVal } from '../utils/utils'
  import TextSwiper from '../components/TextSwiper.vue'
  import Bind from '../components/Bind.vue'
  import Buy from '../components/Buy.vue'
  import NoWallet from '../components/NoWallet.vue'
  import Modal from '../components/Modal.vue'
  import '../assets/css/index.css'

  export default {
    name: 'index',
    data: () => {
      return {
        showBind: false,
        showBuy: false,
        showInvite: false,
        showNoInstalled: false,
        tabIndex: 0,
        showWallet: false,
        inviteCode: '',
        leftTime: 0,
        loading: true
      }
    },
    async mounted(){
      this.$store.dispatch('getCurrnRoundInfo')
      this.$store.dispatch('getAccountInfo')

      setInterval(() => {
        this.$store.dispatch('getCurrnRoundInfo')
        this.$store.dispatch('getAccountInfo')
        this.computedLeftTime()
      }, 1000)
    },
    watch: {
      roundInfo(newInfo, oldInfo){
        if (newInfo.end_time != oldInfo.end_time || newInfo.start_time != oldInfo.start_time) {
          this.computedLeftTime()
          this.loading = false
        }
        if (!newInfo.lead_player) {
          this.$store.dispatch('getPreRoundInfo')
        }
      },
      roundState(newState, oldState){
        if (newState != oldState) {
          let leftTime = 0
          let now = parseInt((new Date().getTime()) / 1000)
          if (this.roundState == 1) {
            leftTime = this.roundInfo.end_time - now
          } else if (this.roundState == 2) {
            leftTime = this.roundInfo.start_time - now
          }
          if (isNaN(leftTime) || leftTime < 0) {
            leftTime = 0
          }
          this.leftTime = leftTime
        }
      }
    },
    computed: {
      ...mapState({
        'logined': 'logined',
        'inApp': 'inApp',
        'accountInfo': 'accountInfo',
        'roundInfo': 'roundInfo',
        'eosPrice': 'eosPrice',
        'accountName': 'accountName',
        'preRoundInfo': 'preRoundInfo',
        'rate': 'rate',
        'currency': 'currency',
        'lang': 'lang',
        'isIOS': 'isIOS',
        'styleModel': 'styleModel'
      }),
      gameClass(){
        let obj = {}
        obj[`gameModel${this.styleModel}`] = true
        return obj
      },
      titleImg(){
        return `./static/imgs/index_title_${this.styleModel}.png`
      },
      headerIcon(){
        return `./static/imgs/header_icon_${this.styleModel}.png`
      },
      broadcastIcon(){
        return `./static/imgs/broadcast_${this.styleModel}.png`
      },
      pondIcon(){
        return `./static/imgs/pond_icon_${this.styleModel}.png`
      },
      keyIcon(){
        return `./static/imgs/key_${this.styleModel}.png`
      },
      earningIcon(){
        return `./static/imgs/earning_${this.styleModel}.png`
      },
      modelStr(){
        let time = 24
        if (this.styleModel && this.styleModel == 1) {
          time = 6
        }
        return time
      },
      myKeys(){
        let keys = 0
        if (this.accountInfo.keys && this.accountInfo.round_id == this.roundInfo.round_id) {
          keys = this.accountInfo.keys
        }
        return keys
      },
      potVal(){
        let val = 0
        if (this.roundState != 1) {
          return val
        }
        if (this.roundInfo && this.roundInfo.pot) {
          val = dealVal(this.roundInfo.pot)
        }
        return val
      },
      porFontSize(){
        let length = this.potVal && this.potVal.toString().length || 0
        let size = 0.58
        if (length > 8) {
          size = size - (length - 8) * 0.04
        }
        return size
      },
      tokenVal(){
        let val = 0
        if (this.roundState != 1) {
          return val
        }
        if (this.roundInfo && this.roundInfo.tokens) {
          val = dealVal(this.roundInfo.tokens)
        }
        return val
      },
      grantedVal(){
        let val = 0
        if (this.roundState != 1) {
          return val
        }
        if (this.roundInfo) {
          let sum = 0
          if (this.roundInfo.team_stat_1) {
            sum = sum + parseInt(this.roundInfo.team_stat_1) * 0.8
          }
          if (this.roundInfo.team_stat_2) {
            sum = sum + parseInt(this.roundInfo.team_stat_2) * 0.6
          }
          if (this.roundInfo.team_stat_3) {
            sum = sum + parseInt(this.roundInfo.team_stat_3) * 0.4
          }
          if (this.roundInfo.team_stat_4) {
            sum = sum + parseInt(this.roundInfo.team_stat_4) * 0.2
          }
          val = dealVal(sum)
        }
        return val
      },
      totalTime(){
        let second = 0
        let year = 0
        if (this.roundInfo && this.roundInfo.keys) {
          second = Math.floor((this.roundInfo.keys / Math.pow(10, 8)) * 30)
          year = (second / 31536000).toFixed(4)
        }
        return {second, year}
      },
      roundState(){
        let state = 0
        let now = (new Date().getTime()) / 1000
        if (this.roundInfo) {
          if (now < this.roundInfo.start_time) {
            state = 2
          } else {
            state = 1
          }
        }
        return state
      }, leftTimeStr(){
        let leftTimeStr = "00:00:00"
        let leftTime = this.leftTime
        if (leftTime > 0) {
          let hour = this.dealTimeNum(parseInt(leftTime / (60 * 60)))
          let min = this.dealTimeNum(parseInt((leftTime - hour * 3600) / 60))
          let sec = this.dealTimeNum(parseInt((leftTime - hour * 3600 - min * 60)))
          leftTimeStr = `${hour}:${min}:${sec}`
        }
        return leftTimeStr
      }, broadcastStr(){
        let str = ''
        if (this.roundInfo.lead_player) {
          str = `${this.roundInfo.lead_player} ${this.$t('TOAST.B_LAST_KEY')}`
        } else if (this.preRoundInfo.lead_player) {
          str = `${this.preRoundInfo.lead_player} ${this.$t('TOAST.W_LAST_ROUND')}`
        } else {
          str = this.$t('TOAST.BUY_EARLIER')
        }
        return str
      }
    },
    components: {
      Bind,
      Buy,
      TextSwiper,
      Modal,
      NoWallet,
    },
    methods: {
      toast(text){
        this.$notify({
          group: 'toast',
          text: text,
          duration: 1000
        })
        document.getElementById("toast").setAttribute("style", "")
      },
      changeTab(tabIndex){
        this.tabIndex = tabIndex
      },
      computedLeftTime(){
        let leftTime = 0
        let now = parseInt((new Date().getTime()) / 1000)
        if (this.roundState == 1) {
          leftTime = this.roundInfo.end_time - now
        } else if (this.roundState == 2) {
          leftTime = this.roundInfo.start_time - now
        }

        if (isNaN(leftTime) || leftTime < 0) {
          leftTime = 0
        }
        this.leftTime = leftTime
      },
      toBuy(){
        if (!this.inApp) {
          setTimeout(() => {
            this.showNoInstalled = true
          }, 100)
          return false
        }
        this.showBuy = true
      },
      toWithdraw(){
        if (!this.inApp) {
          this.showNoInstalled = true
          return false
        }
        if (!this.logined) {
          this.toast(this.$t('TOAST.LOGIN_FIRST'))

        } else {
          this.$router.push('earning')
        }
      },
      toInvite(){
        if (!this.inApp) {
          this.showNoInstalled = true
          return false
        }
        if (!this.logined) {
          this.toast(this.$t('TOAST.LOGIN_FIRST'))

        } else {
          this.$router.push('invite')
        }
      },
      dealTimeNum(num){
        if (num < 10) {
          num = "0" + num.toString()
        }
        return num
      },
      toInstall(){
       //todo
      },
      dealKeyVal(val){
        return dealVal(val)
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
      }, toRule(){
        window.location.href = './full_one_help.html'

      }, toTeamHelp(){
        window.location.href = './full_one_help.html#TEAM'
      }, back(){
        this.$router.push('/')
        this.$destroy()
      }
    }
  }
</script>
<style scpoed>
    .index::-webkit-scrollbar {
        width: 0px;
        -webkit-overflow-scrolling: touch;
    }

    .buy-enter, .fade-enter-active {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

    .no_begin_btn {
        width: 2.75rem;
        height: 0.5rem;
        line-height: 0.5rem;
        background-image: linear-gradient(-90deg, #32F8FF 3%, #FC00FF 99%);
        border-radius: 0.06rem;
        font-family: PingFangSC-Medium;
        font-size: 0.18rem;
        color: #250061;
        letter-spacing: 0;
        text-align: center;
        margin: 0.2rem auto 0 auto;
        opacity: 0.4;
    }

    .loading {
        font-size: 0.2rem;
    }

    .game_model {
        color: #FFFFFF;
        text-align: center;
    }
</style>