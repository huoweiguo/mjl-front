<template>
  <div class="home_container">
    <div class="home_container_amount">
      <h2>{{ info.amount }} টাকা </h2>
      <p>অর্ডার আইডি: {{ info.platOrderSn }}</p>
    </div>
    <div class="home_payment">
      <span>Payment channel</span>
      <p>পেমেন্ট চ্যানেল {{ payment }} </p>
    </div>
    <div class="home_payment_item">
      <div v-for="item in info.payMethod" :key="item.code" @click="setPayment(item.code, item)">
        <img v-if="item.code === 'BKASH'" src="@/assets/images/bkash.png" />
        <img v-if="item.code === 'NAGAD'" src="@/assets/images/pay-icon.png" />
        <img v-if="item.code === payment" src="@/assets/images/radio_blue.png" class="radio_btn" />
        <img v-else src="@/assets/images/radio_gray.png" class="radio_btn" />
      </div>
    </div>

    <!--原生-->
    <div v-if="isPristine">
      <div class="payment_desc">
        <span>Wallet Account Numbe</span>
        <em>ওয়ালেট অ্যাকাউন্ট নম্বর</em>
      </div>
      <input class="payment_ipt" type="text" placeholder="Enter your wallet account number" v-model="acc" />

      <div class="home_input">
        <van-button :loading="naLoading" type="primary" class="home_submit_btn" loading-type="spinner"
          loading-text="loading..." @click="accSubmit">Submit</van-button>
      </div>
      <div class="payment_attenion">
        After clicking submit, the official payment page of bkash will
        open. Please fill in the information and complete the payment
        according to the process.
      </div>
      <div class="payment_attenion">
        সাবমিট ক্লিক করার পর, বিকাশের অফিসিয়াল পেমেন্ট পেজটি খুলবে। অনুগ্রহ
        করে তথ্য পূরণ করুন এবং প্রক্রিয়া অনুযায়ী পেমেন্ট সম্পন্ন করুন।
      </div>
    </div>

    <!--非原生-->
    <div v-else>
      <div class="home_payment_step">
        <span>ধাপ 1. সুবিধাভোগী অ্যাকাউন্ট নম্বরটি কপি করুন</span>
        <i>Step 1. Copy the beneficiary account number</i>
      </div>
      <div class="home_payment_number">
        <span>সংখ্যা</span>
        <div>
          <i>{{ toAccount }}</i>
          <img src="@/assets/images/copy-icon.png" @click="copyText" />
        </div>
      </div>

      <div class="home_payment_box" v-if="payment === 'BKASH'">
        <p>এই বিকাশ এজেন্ট অ্যাকাউন্টে অর্থ প্রদান করতে ক্যাশ আউট ব্যবহার করুন</p>
        <p>To make a payment to this bKash agent account, please use the Cash Out option.</p>
      </div>
      <div class="home_payment_box" v-if="payment === 'NAGAD'">
        <p>এই নগদ এজেন্ট অ্যাকাউন্টে অর্থ প্রদান করতে ক্যাশ আউট ব্যবহার করুন</p>
        <p>To make a payment to this Nagad agent account, please use the Cash Out option.</p>
      </div>

      <div class="home_payment_step">
        <span>ধাপ 2. আপনার TxnID পূরণ করুন।</span>
        <i>Step 2. Please fill in your TxnID</i>
      </div>

      <div class="home_input">
        <input type="text" placeholder="Enter your TxnID number" v-model="txnId" />
      </div>

      <div class="home_input">
        <van-button :loading="reLoading" class="home_submit_btn" loading-type="spinner" loading-text="loading..."
          @click="resubmit">Submit</van-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderInfo, reOrder, submit } from '@/api/api.ts'
import { showToast, showLoadingToast } from 'vant';
const route = useRoute()
const router = useRouter()
const isPristine = ref(true)
const loading = ref(false)
// 非原生加载中
const reLoading = ref(false)
// 原生加载中
const naLoading = ref(false)
const acc = ref('')
const info = reactive({
  amount: '0',
  idNumber: '',
  payLink: '',
  ref: '',
  payMethod: [],
  platOrderSn: ''
})
const txnId = ref('')
const sn = route.params.sn
const bankCode = route.query.bankCode || 'BKASH'
const payment = ref(route.query.bankCode || 'BKASH')
const callbackNative = ref(false)
const toAccount = ref('')

const setPayment = (val, obj) => {
  if (!loading.value) {
    payment.value = val
    isPristine.value = obj.isPristine
    if (!obj.isPristine) {
      orderInfo(sn, val)
    }
  } else {
    // 加载接口不能点击
    showLoadingToast({
      message: 'Data not loaded yet, please click later',
      forbidClick: true,
    })
  }
}

const resubmit = () => {
  if (txnId.value.replace(/\s/g, '') === '') {
    showToast('Enter your TxnID number')
    return false
  }
  reLoading.value = true
  reOrder({
    sn,
    txnId: txnId.value,
    code: payment.value,
    amount: info.amount,
    toAccount: toAccount.value
  }).then(res => {
    reLoading.value = false
    if (res.data.status === 200) {
      router.push(`/message/${info.platOrderSn}?ref=${info.ref}`)
    } else {
      showToast(res.data.msg)
    }
  })
}

const accSubmit = () => {
  if (acc.value.replace(/\s/g, '').length === 0) {
    showToast('Enter your wallet account number')
    return false
  }
  naLoading.value = true
  submit({
    sn,
    code: payment.value,
    country: 'BD',
    acc: acc.value,
  }).then(res => {
    naLoading.value = false
    if (res.data.status === 200) {
      window.location.href = res.data.data?.payLink
    } else {
      showToast(res.data.msg)
    }
  })
}

// 使用现代的Clipboard API
const copyText = () => {
  const textToCopy = toAccount.value
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      showToast('Replicating Success');
    })
    .catch(err => {
      showToast("Copy failed, please manually copy");
    });
}

const orderInfo = (sn, bankCode) => {
  loading.value = true
  let toast = showLoadingToast({
    message: 'loading...',
    forbidClick: true,
  })
  getOrderInfo(sn, bankCode).then(res => {
    loading.value = false
    toast.close()
    if (res.data.status === 200) {
      const data = res.data.data
      info.amount = data.amount
      info.payMethod = data.payMethod
      info.platOrderSn = data.platOrderSn
      info.ref = data.ref
      // 判断状态
      if (data.orderStatus !== 'PENDING') {
        router.push(`/message/${data.platOrderSn}?ref=${info.ref}`)
        return false
      }
      const currentPayMethod = data.payMethod.find(item => item.code === bankCode)
      if (currentPayMethod && Object.keys(currentPayMethod).length > 0) {
        isPristine.value = currentPayMethod.isPristine
        toAccount.value = currentPayMethod.toAccount
        // if (!currentPayMethod.isPristine) {
        //   if (!callbackNative.value) {
        //     callbackNative.value = true
        //     orderInfo(sn, currentPayMethod.code)
        //   }
        // }
      }
    } else {
      showToast(res.data.msg)
    }
  })
}

onMounted(() => {
  orderInfo(sn, bankCode)
})
</script>

<style lang="scss" scoped>
.home_container {
  padding: 0.4rem;

  .home_container_amount {
    width: 100%;
    padding: 0.6rem 0.4rem;
    background: linear-gradient(312deg, #175CCD 0%, #1D60CD 100%);
    box-shadow: 0px 0px 0.3rem 0px rgba(34, 88, 176, 0.6);
    border-radius: 0.35rem;
    box-sizing: border-box;
    margin-bottom: 0.55rem;

    h2 {
      color: #fff;
      font-size: 0.54rem;
      font-weight: normal;
      margin-bottom: 0.24rem;
    }

    p {
      color: #fff;
      font-size: 0.34rem;
      line-height: 0.5rem;
      font-weight: normal;
    }
  }

  .home_payment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.3rem;

    span {
      font-size: 0.28rem;
      font-family: '苹方-简 中粗体';
      font-weight: 600;
    }

    p {
      font-size: 0.2rem;
      font-family: 'Kohinoor Bangla Bold';
      font-weight: Bold;
    }
  }

  .home_payment_item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid rgba(123, 123, 123, 0.3);
    margin-bottom: 0.35rem;

    &>div {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #FFFFFF;
      box-shadow: 0px 0px 26px -1px rgba(31, 92, 183, 0.4);
      border: 1px solid rgba(30, 95, 185, 0.5);
      width: 40%;
      margin: 0 5%;
      padding: 0.2rem 0;

      img {
        height: 0.8rem;
      }

      .radio_btn {
        margin-left: 0.2rem;
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }

  .payment_desc {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 0.28rem;
      color: #252525;
      font-family: "苹方-简 中粗体";
      font-weight: 600;
    }

    em {
      font-size: 0.2rem;
      color: #252525;
      font-family: "苹方-简 中粗体";
      font-weight: 600;
      font-style: normal;
    }
  }

  .payment_attenion {
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 0.24rem;
    color: #000000;
    line-height: 0.3rem;
    margin: 0.3rem 0;
  }

  .payment_ipt {
    height: 40px;
    width: 100%;
    box-shadow: 0px 0px 6px 2px rgba(31, 92, 183, 0.4);
    border-radius: 6px;
    border: 1px solid rgba(30, 95, 185, 0.4);
    padding: 0 0.2rem;
    box-sizing: border-box;
    outline: none;
    font-size: 0.28rem;

    &::placeholder {
      font-size: 0.26rem;
      color: #A0A0A0;
      font-family: "苹方-简 常规体";
    }
  }

  .home_payment_step {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.35rem;

    span {
      display: flex;
      font-size: 0.26rem;
      color: #175DCE;
      font-family: KohinoorBangla, KohinoorBangla;
      margin-bottom: 0.1rem;
      font-weight: bold;
    }

    i {
      font-size: 0.22rem;
      font-style: normal;
      font-family: PingFangSC, PingFang SC;
    }
  }

  .home_payment_number {
    margin-bottom: 0.35rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 0.24rem;
      font-weight: 600;
      color: #252525;
    }

    &>div {
      display: flex;
      align-items: center;

      i {
        font-size: 0.28rem;
        font-weight: 600;
        color: #252525;
        font-style: normal;
        font-family: KohinoorBangla, KohinoorBangla;
      }

      img {
        width: 0.35rem;
        margin-left: 0.3rem;
      }
    }
  }

  .home_payment_box {
    display: flex;
    flex-direction: column;
    padding: 0.11rem 0.13rem;
    background: #FDEFF1;
    border-radius: 0.08rem;
    gap: 0.2rem;
    margin-bottom: 0.35rem;

    p {
      font-size: 0.22rem;
      font-family: KohinoorBangla, KohinoorBangla;
    }
  }

  .home_input {
    display: flex;

    input[type="text"] {
      display: flex;
      width: 100%;
      height: 0.8rem;
      border: 1px solid #D3D3D3;
      padding: 0 0.22rem;
      outline: none;
      box-sizing: border-box;
      font-size: 0.28rem;
    }

    .home_submit_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 0.8rem;
      margin-top: 0.8rem;
      background: #203268;
      box-shadow: inset 0px 0px 2px 0px rgba(0, 0, 0, 0.2);
      border-radius: 40px;
      border: 1px solid #203268;
      opacity: 0.5;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      font-size: 0.3rem;
      color: #FFFFFF;
      line-height: 42px;
    }
  }
}
</style>