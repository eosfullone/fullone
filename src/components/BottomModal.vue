<template>
    <transition name="modal">
        <div class="modal-mask" @click="$emit('close')">
            <div class="modal-wrapper">
                <div class="modal-container" @click.stop>
                    <div class="container-bg">
                        <div class="top-btns">
                            <div v-if="backBtn" class="modal-back" @click="$emit('back')">
                                <img src="../assets/imgs/back.png">
                            </div>
                            <div v-if="closeBtn" class="close" @click="$emit('close')">
                                <img src="../assets/imgs/close.png">
                            </div>
                        </div>
                        <div class="modal-main">
                            <div class="modal-header fade">
                                <slot name="header">
                                    default header
                                </slot>
                            </div>
                            <div class="bottom-modal-body" :class="transClass">
                                <slot name="body">
                                    default body
                                </slot>
                            </div>
                            <div class="modal-footer" :class="transClass">
                                <slot name="footer">
                                    default footer
                                    <button class="modal-default-button" @click="$emit('close')">
                                        OK
                                    </button>
                                </slot>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
  export default{
    props: ['closeBtn', 'backBtn', 'transName'],
    mounted(){
      document.body.style.position = 'fixed'
    },
    destroyed(){
      document.body.style.position = 'relative'
    },
    computed: {
      transClass(){
        let className = this.transName || 'fade'
        let obj = {}
        obj[className] = true
        return obj
      },
    }
  }
</script>
<style scoped>
    .modal-mask {
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .top-btns {
        height: 0.5rem;
    }

    .top-btns .modal-back {
        float: left;
        position: relative;
        margin-top: 0.15rem;
        margin-left: 0.2rem;
        width: 0.3rem;
    }

    .modal-back img {
        width: 0.14rem;
        height: 0.22rem;
    }

    .close {
        float: right;
        position: relative;
        margin-top: 0.15rem;
        margin-right: 0.2rem;
    }

    .close img {
        width: 0.2rem;
        height: 0.2rem;
    }

    .modal-wrapper {
        /*display: table-cell;*/
        /*vertical-align: middle;*/
    }

    .modal-container {
        width: 100%;
        background: #250061;
        border-top: 0.02rem solid #00FAFF;
        border-radius: 0.12rem 0.12rem 0 0;
        padding: 0 0.02rem;
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        position: fixed;
        bottom: 0;
        max-height: 5.12rem;
        animation: slide-in 0.5s;
    }

    @keyframes slide-in {
        0% {
            margin-bottom: -5.12rem;
        }

        100% {
            margin-bottom: 0rem;
        }
    }

    .modal-container .container-bg {
        background: url("../assets/imgs/modal_bg.png");
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .modal-main {
        max-height: 4.62rem;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {

    }

    .modal-default-button {
        float: right;
    }

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    /*.modal-enter .modal-container,*/
    /*.modal-leave-active .modal-container {*/
    /*-webkit-transform: scale(1.1);*/
    /*transform: scale(1.1);*/
    /*}*/


</style>