<template>
    <div class="bind">
        <Modal @close="close" class="step1" closeBtn="true">
            <div slot="header">
                <div class="bind_title">您所使用的EOS账户</div>
                <div class="use_account">{{this.accountName}}</div>
            </div>
            <div slot="body">
                <div>
                    <div class="invite_tip">请输入邀请码(选填)</div>
                    <div class="invite_code"><input v-model="aff"></div>
                </div>
            </div>
            <div slot="footer" class="confirm">
                <div class="confirm_btn" @click="confirm">确认</div>
            </div>
        </Modal>
    </div>
</template>
<script>
  import Modal from './Modal.vue'
  import { mapState } from 'vuex'
  export default{
    data: () => {
      return {
        show: false,
        selectIndex: 0,
        aff: '',
        accounts: []
      }
    },
    mounted(){
      let aff = window.localStorage.getItem("aff")
      if (aff) {
        this.aff = aff
      }
    },
    computed: {
      ...mapState({
        'accountName': 'accountName'
      })
    },
    components: {
      Modal
    },
    methods: {
      close(){
        this.$emit('close')
      },
      confirm(){
        window.localStorage.setItem("aff", this.aff)
        this.$emit('close')
      },
      select(index){
        console.log(index)
        this.selectIndex = index
      }
    }
  }
</script>
<style scoped>
    .bind {
        position: absolute;
        top: 0;
        left: 0;
    }

    .bind_title {
        padding-top: 0.3rem;
        padding-left: 0.2rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #666666;
        letter-spacing: 0;
        line-height: 0.28rem;
    }

    .use_account {
        font-family: PingFangSC-Regular;
        font-size: 0.18rem;
        color: #323232;
        letter-spacing: 0;
        padding-left: 0.2rem;
        padding-top: 0.05rem;
    }

    .invite_tip {
        padding-left: 0.2rem;
        padding-top: 0.2rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #666666;
        letter-spacing: 0;
    }

    .invite_code input {
        background: #FFFFFF;
        border: 0.01rem solid #E8E8E8;
        border-radius: 0.06rem;
        height: 0.5rem;
        line-height: 0.5rem;
        margin: 0.1rem 0 0.2rem 0.2rem;
        font-family: PingFangSC-Regular;
        font-size: 0.18rem;
        color: #323232;
        letter-spacing: 0;
        padding: 0 0.2rem;
        width:1.95rem;
    }

    .accounts {
        display: flex;
        flex-direction: column;
    }

    .accounts .account {
        border: solid 0.01rem #D7D7D7;
        margin-top: 0.1rem;
    }

    .accounts .account.active {
        border: solid 0.01rem cornflowerblue;
    }

    .confirm {
        margin-top: 0.1rem;
        display: flex;
        justify-content: center;
    }

    .confirm_btn {
        background: #661885;
        border-radius: 0.06rem;
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        width: 1.72rem;
        font-family: PingFangSC-Medium;
        font-size: 0.18rem;
        color: #F3F4F5;
        letter-spacing: 0;
        margin-bottom: 0.2rem;
    }

    .modal_body {

    }

</style>