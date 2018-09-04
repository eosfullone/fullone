<template>
    <div class="wallet">
        <Modal @close="close" class="step1" closeBtn="true">
            <div slot="header">
                <div class="wallet_title">你还未拥有 EOS 钱包</div>
            </div>
            <div slot="body">
                <div class="wallet_btns">
                    <div class="wallet_btn active">+ 导入EOS钱包</div>
                    <div class="wallet_btn">创建EOS钱包</div>
                </div>
            </div>
            <div slot="footer" class="confirm">
                <!--<div class="confirm_btn" @click="confirm">确认</div>-->
            </div>
        </Modal>
    </div>
</template>
<script>
  import Modal from './Modal.vue'
  export default{
    data: () => {
      return {
        show: false,
        selectIndex: 0,
        inviteCode: '',
        accounts: []
      }
    },
    mounted(){
    },
    components: {
      Modal
    },
    methods: {
      close(){
        this.$emit('close')
      },
      confirm(){
        this.$emit('close')
      },
      select(index){
        this.selectIndex = index
      }
    }
  }
</script>
<style scoped>
    .wallet {
        position: absolute;
        top: 0;
        left: 0;
    }

    .wallet_title {
        padding-top: 0.3rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #666666;
        letter-spacing: 0;
        line-height: 0.28rem;
        text-align: center;
    }

    .invite_code input {
        background: #FFFFFF;
        border: 0.01rem solid #E8E8E8;
        border-radius: 0.06rem;
        height: 0.5rem;
        line-height: 0.5rem;
        width: 2.35rem;
        margin: 0.1rem 0 0.2rem 0.2rem;
        font-family: PingFangSC-Regular;
        font-size: 0.18rem;
        color: #323232;
        letter-spacing: 0;
        padding: 0 0.2rem;
    }

    .wallet_btns {
        padding-top: 0.16rem;
    }

    .wallet_btn {
        margin-left: 0.1rem;
        width: 2.55rem;
        height: 0.8rem;
        line-height: 0.8rem;
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #323232;
        letter-spacing: 0;
        text-align: center;
    }

    .wallet_btn.active {
        background: white;
        border-radius: 0.06rem;
        font-family: PingFangSC-Medium;
        color: #323232;
    }

    .confirm {
        margin-top: 0.1rem;
        display: flex;
        justify-content: center;
    }

    .confirm_btn {
        background: #2C34AC;
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
        margin-left: 0;
    }

</style>