<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper" @click="$emit('close')">
                <div class="modal-container"  @click.stop>
                    <div v-if="closeBtn" class="close" @click="$emit('close')">
                        <img src="../assets/imgs/close.png">
                    </div>
                    <div class="modal-header fade">
                        <slot name="header">
                            default header
                        </slot>
                    </div>
                    <div class="modal-body" :class="transClass">
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
    </transition>
</template>
<script>
  export default{
    props: ['closeBtn', 'transName'],
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
        z-index: 99;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .close {
        float: right;
        position: relative;
        margin-top: 0.08rem;
        margin-right: 0.1rem;
    }

    .close img {
        width: 0.18rem;
        height: 0.18rem;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        width: 2.75rem;
        margin: 0 auto;
        background-color: #F3F4F5;
        border-radius: 0.1rem;
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        overflow: hidden
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

    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

    .modal-container .slide {
        animation: slide-in 0.5s;
    }

    @keyframes slide-in {
        0% {
            margin-left: 1rem;
        }

        100% {
            margin-left: 0rem;
        }
    }

</style>