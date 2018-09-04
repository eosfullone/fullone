<template>
    <div class="main_view">
        <div class="main_container">
            <div class="back" :class="{ios:isIOS}" @click="toExit">
                <div class="back_btn">
                    <img src="../../public/static/imgs/back.png">
                </div>
            </div>
            <div class="header">
                <div class="header_btn left" :class="{en:lang=='en'}" @click="toRule">{{$t('BTN.RULE')}}</div>
                <div class="header_btn right" :class="{en:lang=='en'}" @click="toInvite">{{$t('BTN.INVITE')}}</div>
            </div>
            <div class="main_top">
                <div class="main_title_bg">
                    <img src="../../public/static/imgs/main_title.png">
                </div>
            </div>
            <div class="my_profits">
                <div class="left_area">
                    <div class="main_profit_title">{{$t('TIP.MY_PROFITS')}}:</div>
                    <div class="main_profit_val">{{myProfits}} EOS</div>
                </div>
                <div class="withdraw_all_btn" @click="withdraw">
                    {{$t('BTN.MAIN_WITHDRAW')}}
                </div>
            </div>

            <div class="games">
                <div class="game" :class="getGameClass(index)" v-for="(round,index) in rounds"
                     @click="enterRound(round.contract,index)">
                    <div class="round_loading" v-if="!round || !round.loaded">
                        loading...
                    </div>
                    <div v-if="round && round.loaded">
                        <div v-if="round.roundState==1 && round.leftTime>0">
                            <div class="round_left">
                                <div class="round_tip" v-if="lang=='zh'">
                                    {{getLeftTimeStr(round.leftTime)}} 后开奖
                                </div>
                                <div class="round_tip" v-if="lang=='en'">
                                    {{$t('TIP.OVER_TIME')}}:{{getLeftTimeStr(round.leftTime)}}
                                </div>
                                <div class="round_pot">
                                    {{round.pot}} EOS
                                </div>
                            </div>
                            <div class="round_right">
                                <div class="round_buy_btn">
                                    {{$t('BTN.BUY_KEY')}}
                                </div>
                            </div>
                        </div>
                        <div v-if="round.roundState==1 && round.leftTime==0">
                            <div class="round_left">
                                <div class="round_tip">
                                    {{$t('TIP.NEXT_ROUND')}}
                                </div>
                                <div class="round_pot">
                                    {{round.pot}} EOS
                                </div>
                            </div>

                            <div class="round_right">
                                <div class="round_enter_btn">
                                    <img :src="getEnterIcon(index)">
                                </div>
                            </div>
                        </div>
                        <div v-if="round.roundState==2">
                            <div class="round_left">
                                <div class="round_tip">
                                    {{$t('TIP.BEFOR')}} ROUND {{round.round_id}} {{$t('TIP.BEGIN')}}
                                </div>
                                <div class="round_pot">
                                    {{getLeftTimeStr(round.leftTime)}}
                                </div>
                            </div>
                            <div class="round_right">
                                <div class="round_enter_btn">
                                    <img :src="getEnterIcon(index)">
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            <Bind v-if="showBind" @close="showBind=false"></Bind>
            <Modal @close="showNoInstalled=false" class="step1" closeBtn="true" v-if="showNoInstalled">
                <div slot="header" class="title">
                    <div class="noinstall_title" v-html="$t('TIP.NOINSTALL_TITLE')"></div>
                </div>
                <div slot="body"></div>
                <div slot="footer" class="confirm">
                    <div class="install_btn" @click="toInstall">{{$t('BTN.NOT_INSTALL')}}</div>
                </div>
            </Modal>
            <BottomModal @close="showWithDraw = false" class="main_with_draw" closeBtn="true" v-if="showWithDraw">
                <div slot="header">

                </div>
                <div slot="body">
                    <div class="with_draw_info">
                        <div class="with_draw_item">
                            <div class="item_title">{{$t('TIP.WITHDRAW')}}：</div>
                            <div class="item_val">{{myProfits}} EOS</div>
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
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getQueryStr, dealVal } from '../utils/utils'
  import { EosService } from '../service'
  import BottomModal from '../components/BottomModal.vue'
  import Bind from '../components/Bind.vue'
  import Modal from '../components/Modal.vue'
  import CONFIG from '../config.js'
  import '../assets/css/index.css'

  export default {
    name: 'index',
    data: () => {
      return {
        showBind: false,
        showNoInstalled: false,
        inviteCode: '',
        leftTime: 0,
        loading: true,
        eosService: {},
        showWithDraw: false,
        contracts: CONFIG.CONTRACTS,
        rounds: {
          0: {},
          1: {},
        },
        profits: {
          0: 0,
          1: 0,
        }
      }
    },
    async mounted(){
      let inited = window.localStorage.getItem("inited")
      if (!inited && this.inApp) {
        this.showBind = true
        window.localStorage.setItem("inited", true)
      }
      this.eosService = new EosService()
      this.loadAllContracts()
      setInterval(() => {
        this.loadAllContracts()
      }, 30000)
      setInterval(() => {
        this.computedAllLeftTime()
      }, 1000)
    },
    watch: {},
    computed: {
      ...mapState({
        'logined': 'logined',
        'inApp': 'inApp',
        'eosPrice': 'eosPrice',
        'accountName': 'accountName',
        'rate': 'rate',
        'currency': 'currency',
        'lang': 'lang',
        'isIOS': 'isIOS'
      }),
      myProfits(){
        let profits = this.profits
        let sum = 0
        for (let index in profits) {
          let val = profits[index]
          if (val) {
            sum = parseFloat(sum) + parseFloat(val)
          }
        }
        return sum.toFixed(4)
      }
    },
    components: {
      Bind,
      Modal,
      BottomModal
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
      loadAllContracts(){
        this.contracts.forEach((contract, index) => {
          this.loadContract(contract, index)
        })
      },
      async loadContract(contract, index){
        try {
          let data = await this.eosService.getCurrnRoundInfo(contract)
          if (data) {
            let obj = {}
            let dealObj = this.dealRoundData(data, contract)
            if (this.rounds[index] != dealObj) {
              obj[`${index}`] = dealObj
              this.rounds = Object.assign(this.rounds, obj)
            }
          }
          let accountData = await this.eosService.getAccountInfo(contract, this.accountName)
          if (accountData && accountData.rows && accountData.rows[0]) {
            let account = accountData.rows[0]
            if (account && account.player == this.accountName) {
              this.dealAccountData(account, index)
            }
          }
        } catch (err) {
          console.log(err)
        }
      },
      dealRoundData(roundInfo, contract){
        let state = this.roundState(roundInfo)
        let round = {
          contract: contract,
          round_id: roundInfo.round_id,
          roundState: state,
          leftTime: this.computedLeftTime(roundInfo, state),
          pot: this.potVal(roundInfo, state),
          start_time: roundInfo.start_time,
          end_time: roundInfo.end_time,
          loaded: true
        }
        return round
      },
      roundState(roundInfo){
        let state = 0  // 0:no round  1:进行中  2.未开始
        let now = (new Date().getTime()) / 1000
        if (roundInfo) {
          if (now < roundInfo.start_time) {
            state = 2
          } else {
            state = 1
          }
        }
        return state
      },
      dealAccountData(account, index){
        let val = 0
        if (account) {
          val = val + parseFloat(account.earn_aff)
          val = val + parseFloat(account.earn_gen)
          val = val + parseFloat(account.earn_win)
          val = val / Math.pow(10, 8)
          if (val < 0.0001) {
            val = 0
          } else {
            val = val.toFixed(4)
          }
          if (isNaN(val)) {
            val = 0
          }
        }
        if (this.profits[index] != val) {
          let obj = {}
          obj[`${index}`] = val
          this.profits = Object.assign(this.profits, obj)
        }
      },
      computedLeftTime(roundInfo, roundState, index){
        let leftTime = 0
        let now = parseInt((new Date().getTime()) / 1000)
        if (roundState == 1) {
          leftTime = roundInfo.end_time - now
          if (leftTime <= 1) {
            this.loadContract(roundInfo.contract, index)
          }
        } else if (roundState == 2) {
          leftTime = roundInfo.start_time - now
          if (leftTime <= 1) {
            this.loadContract(roundInfo.contract, index)
          }
        }
        if (isNaN(leftTime) || leftTime < 0) {
          leftTime = 0
        }
        return leftTime
      },
      computedAllLeftTime(){
        for (let index in this.rounds) {
          let round = this.rounds[index]
          if (round && round.leftTime) {
            round.leftTime = this.computedLeftTime(round, round.roundState, index)
            let obj = {}
            obj[`${index}`] = round
            this.rounds = Object.assign(this.rounds, obj)
          }
        }
      },
      potVal(roundInfo, roundState){
        let val = 0
        if (roundState != 1) {
          return val
        }
        if (roundInfo && roundInfo.pot) {
          val = dealVal(roundInfo.pot)
        }
        return val
      },
      getLeftTimeStr(leftTime){
        let leftTimeStr = "00:00:00"
        if (leftTime > 0) {
          let hour = this.dealTimeNum(parseInt(leftTime / (60 * 60)))
          let min = this.dealTimeNum(parseInt((leftTime - hour * 3600) / 60))
          let sec = this.dealTimeNum(parseInt((leftTime - hour * 3600 - min * 60)))
          leftTimeStr = `${hour}:${min}:${sec}`
        }
        return leftTimeStr
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
      withdraw(){
        if (!this.inApp) {
          this.showNoInstalled = true
          return false
        }
        console.log(this.myProfits)
        if (!this.myProfits || parseFloat(this.myProfits) <= 0) {
          return this.toast(this.$t('TOAST.UNABLE_WITHDRAW'))
        }
        this.showWithDraw = true
      },
      async confirm(){
        try {
          let result = await this.eosService.withdraws(this.contracts, this.accountName)
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
          this.toast(err)
        }
      },
      getGameClass(index){
        let obj = {}
        obj[`game${index}`] = true
        return obj
      },
      getEnterIcon(index){
        return `./static/imgs/enter_icon_${index}.png`
      },
      enterRound(contract, index){
//        if (!this.inApp) {
//          this.showNoInstalled = true
//          return false
//        }
//        if (!this.logined) {
//          this.toast(this.$t('TOAST.LOGIN_FIRST'))
//        }
        console.log(index)
        this.$store.dispatch('setStyleModel', {index})
        this.$store.dispatch('setContractName', {contract})
        this.$router.push('index')
      }
      , toRule(){
        if (this.lang == 'en') {
          window.location.href = './full_one_help_en.html'
        } else {
          window.location.href = './full_one_help.html'
        }
      }, toTeamHelp(){
        if (this.lang == 'en') {
          window.location.href = './full_one_help_en.html#TEAM'
        } else {
          window.location.href = './full_one_help.html#TEAM'
        }
      }, toExit(){
        //todo
      }
    }
  }
</script>
<style scoped>
    .main_view::-webkit-scrollbar {
        width: 0px;
        -webkit-overflow-scrolling: touch;
    }

    .main_view {
        width: 100%;
        height: 100%;
        background: #0a0e1d;
    }

    .main_container {
        width: 100%;
        height: 100%;
        background-image: url('../../public/static/imgs/main_bg.png');
        background-size: 100%;
        background-position: 0rem 0.9rem;
        background-repeat: no-repeat;
    }

    .main_top {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 0.6rem;
    }

    .main_title_bg img {
        margin-top: -0.32rem;
        margin-left: 0.05rem;
        width: 3.65rem;
        z-index: 0;
    }

    .my_profits .left_area {
        color: #FFFFFF;
        float: left;
        padding-left: 0.3rem;
    }

    .main_profit_title {
        font-size: 0.2rem;
        color: #FFFFFF;
        letter-spacing: 0;
        font-weight: 200;
    }

    .main_profit_val {
        font-family: PingFangSC-Medium;
        font-size: 0.22rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .withdraw_all_btn {
        float: right;
        width: 1rem;
        height: 0.4rem;
        line-height: 0.4rem;
        background: #FFFFFF;
        border-radius: 1rem;
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 0.16rem;
        color: #2C34AC;
        margin-right: 0.3rem;
        margin-top: 0.1rem;
    }

    .games {
        padding-top: 0.8rem;
        width: 3.35rem;
        margin: 0 auto;
    }

    .game {
        width: 3.35rem;
        height: 0.98rem;

        border-radius: 0.12rem;
        margin-bottom: 0.2rem;
    }

    .game0 {
        background: url("../../public/static/imgs/game_enter_0.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .game1 {
        background: url("../../public/static/imgs/game_enter_1.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .round_loading {
        text-align: center;
        line-height: 0.98rem;
        font-size: 0.25rem;
        color: #FFFFFF;
    }

    .round_left {
        padding: 0.2rem;
        float: left;
    }

    .round_tip {
        font-weight: 200;
        font-size: 0.14rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .round_pot {
        padding-top: 0.1rem;
        font-family: PingFangSC-Medium;
        font-size: 0.2rem;
        color: #FFFFFF;
        letter-spacing: 0;
    }

    .round_right {
        float: right;
    }

    .round_enter_btn {
        margin-top: 0.25rem;
        margin-right: 0.3rem;
        width: 0.45rem;
        height: 0.45rem;
        background: #2835a9;
        border-radius: 0.45rem;
        /*transform: rotate(-45deg);*/
        /*border-right: 2px solid #3EFF47;*/
        /*border-bottom: 2px solid #3EFF47;*/
    }

    .round_enter_btn img {
        width: 0.45rem;
        height: 0.45rem;
    }

    .round_buy_btn {
        margin-top: 0.3rem;
        margin-right: 0.2rem;
        width: 0.88rem;
        height: 0.4rem;
        line-height: 0.4rem;
        background: #FF65F2;
        border: 0.02rem solid #00e3ff;
        border-radius: 1rem;
        font-family: PingFangSC-Medium;
        font-size: 0.16rem;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
    }

    .game1 .round_buy_btn {
        background: #ffcc82;
        border: 0.02rem solid #c63940;
        color: #c63940;
    }

    .main_with_draw .modal-container .confirm_btn {
        background: #444d79;
        color:#FFFFFF;
    }


</style>