<template>
  <div class="message-container">
    <div class="message-item-icon">
      <img src="../assets/images/check-icon.png" class="status-icon"
        v-if="orderState.orderStatus?.toUpperCase() === 'SUCCESS'" />
      <img src="../assets/images/loading-icon.png" class="status-icon"
        v-if="orderState.orderStatus?.toUpperCase() === 'PENDING'" />
      <img src="../assets/images/error.png"
        v-if="(orderState.orderStatus?.toUpperCase() === 'FAILED' || orderState.orderStatus?.toUpperCase() === 'CANCEL')" />
      <h2 v-if="orderState.orderStatus?.toUpperCase() === 'SUCCESS'">Payment successful</h2>
      <h2 v-if="orderState.orderStatus?.toUpperCase() === 'PENDING'">Payment processing</h2>
      <h2
        v-if="(orderState.orderStatus?.toUpperCase() === 'FAILED' || orderState.orderStatus?.toUpperCase() === 'CANCEL')"
        class="fcred">Payment failed</h2>
      <!-- <h4 v-if="orderState.orderStatus?.toUpperCase() === 'PENDING'">
        <p>Please approve the transaction</p>
        <p>in your JazzCash or Easypaisa wallet.</p>
      </h4> -->
      <h5
        v-if="(orderState.orderStatus?.toUpperCase() === 'FAILED' || orderState.orderStatus?.toUpperCase() === 'CANCEL')">
        <p>{{ remark }}</p>
      </h5>
    </div>
    <div class="message-list">
      <div class="message-list-text">
        <span>Order ID</span>
        <span>{{ orderState.platOrderSn }}</span>
      </div>
      <div class="message-list-text">
        <span>Amount</span>
        <span>PKR {{ orderState.amount }}</span>
      </div>
      <div class="message-list-text" v-if="orderState.toAccount">
        <span>toAccount</span>
        <span>{{ orderState.toAccount }}</span>
      </div>
      <div class="message-list-text" v-else>
        <span>Wallet account</span>
        <span>{{ orderState.account }}</span>
      </div>
      <!-- <div class="message-list-text">
        <span>CNIC</span>
        <span>192939192</span>
      </div> -->
      <div class="message-list-text">
        <span>Date</span>
        <span>{{ orderState.payTime }}</span>
      </div>
      <!-- <div class="message-list-text">
        <span>Reference</span>
        <span>6421</span>
      </div> -->
    </div>
    <div class="message-state">State</div>
    <ul class="message-state-list">
      <li>Repayment has been submitted</li>
      <li
        :class="{ 'error-state': (orderState.orderStatus?.toUpperCase() === 'FAILED' || orderState.orderStatus?.toUpperCase() === 'CANCEL') }">
        Wait for processing（About 1-3
        minutes）</li>
      <li
        :class="{ 'error-state': (orderState.orderStatus?.toUpperCase() === 'FAILED' || orderState.orderStatus?.toUpperCase() === 'CANCEL') }">
        Go back to your app and check
        status</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getstatus, getinfo } from "@/api/api";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const orderState = ref({});
const status = ref('');
// const orderInfo = ref({});
const orderId = router.currentRoute.value.params.orderId;
const remark = ref('');
const timer = ref(null);

// 获取订单状态
const getOrderStatus = () => {
  getstatus(orderId, route.query?.ref || '').then((res) => {
    if (res.data.status === 200) {
      orderState.value = res.data?.data;
      if (status.value) {
        orderState.value.orderStatus = status.value;
      }
      if (orderState.value.orderStatus?.toUpperCase() === 'FAILED' || orderState.value.orderStatus?.toUpperCase() === 'CANCEL') {
        remark.value = orderState.value.remark
      }
    }
  })
};

// 获取订单信息
const getOrderInfo = () => {
  getinfo(orderId).then((res) => {
    if (res.data.status === 200) {
      console.log(res.data.data, 'res.data');
      orderInfo.value = res.data?.data;
    }
  })
}

onMounted(() => {
  const queryStatus = route.query.status;
  if (queryStatus) {
    const upCaseStatus = queryStatus.toUpperCase();
    if (upCaseStatus === 'FAILURE') {
      status.value = 'FAILED';
    } else {
      status.value = upCaseStatus;
    }
  }

  // 获取订单状态
  getOrderStatus()
  // 获取订单信息
  // getOrderInfo()

  timer.value = setInterval(() => {
    if (orderState.value.orderStatus?.toUpperCase() === 'PENDING') {
      getOrderStatus()
      //getOrderInfo()
    } else {
      clearInterval(timer.value)
    }
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
.message-container {
  padding: 0.4rem;

  .message-item-icon {
    display: flex;
    flex-direction: column;
    align-items: center;

    .status-icon {
      width: 3rem;
      height: 2.7rem;
    }

    h2 {
      font-weight: 500;
      font-size: 0.5rem;
      color: #2258b0;
      line-height: 0.7rem;
      margin-bottom: 0.8rem;

      &.fcred {
        color: #ea4235;
      }
    }

    h4 {
      font-weight: 500;
      font-size: 0.28rem;
      color: rgba(0, 0, 0, 0.5);
      line-height: 0.4rem;
      text-align: center;
      margin-bottom: 0.8rem;
    }

    h5 {
      font-size: 0.26rem;
      font-weight: normal;
      margin-bottom: 0.4rem;

      p {
        color: #ea4235;
      }
    }
  }

  .message-list {
    .message-list-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.8rem;

      span {
        font-weight: 500;
        font-size: 0.28rem;
        line-height: 0.4rem;

        &:first-child {
          color: #949494;
        }

        &:last-child {
          color: #2258b0;
          font-size: 0.26rem;
        }
      }
    }
  }

  .message-state {
    color: #2258b0;
    font-size: 0.28rem;
    margin: 0.4rem 0;
    text-align: center;
  }

  .message-state-list {
    li {
      position: relative;
      height: 0.4rem;
      line-height: 0.4rem;
      font-weight: 500;
      font-size: 0.28rem;
      color: #000000;
      list-style: none;
      padding-left: 0.5rem;
      background: url(../assets/images/correct.png) 0 0 no-repeat;
      background-size: 0.4rem 0.4rem;
      margin-bottom: 0.6rem;

      &::after {
        content: "";
        display: block;
        position: absolute;
        left: 0.2rem;
        top: 0.4rem;
        height: 0.55rem;
        border-left: 1px dashed #2258b0;
      }

      &.error-state {
        background: url(../assets/images/error.png) 0 0 no-repeat;
        background-size: 0.4rem 0.4rem;
        color: #ea4235;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
