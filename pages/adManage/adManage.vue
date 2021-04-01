<template>
  <view class="adManage">
    <view class="adManage1">
      <block v-for="(item,index) in adData" :key="index">
        <view class="item">
          <view class="item_left">
            <view class="name">{{item.adName}}</view>
            <view class="cost_line">
              <text class="dailyLimit">日限额：{{item.adDailyBudget}}</text>
              <text class="cost">花费：{{item.showCost}}</text>
            </view>
          </view>
          <view class="item_right">{{item.statusName}}</view>
          <view class="op">
            <text class="time">时间：{{item.adStartDate}}至{{item.adEndDate}}</text>
            <text class="edit" @click="editAd(item)" v-if="item.adStatus!=-1">编辑</text>
            <text class="edit_end" @click="editAd(item)" v-if="item.adStatus==-1">编辑</text>
            <text class="opBtn" @click="changeStatus(item,1)" v-if="item.adStatus==3">开始推广</text>
            <text class="opBtn" v-if="item.adStatus==1" @click="handleStop(item,3)">暂停</text>
          </view>
        </view>
      </block>
      <view class="minHeight"></view>
      <view class="add_ad" @click="toAddAd">新增广告</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      adData: [],
      pageNumber: 1,
      pageSize: 10,
      totalPage: 0
    };
  },
  onShow() {
    this.init();
  },
  onPullDownRefresh() {
    this.init();
  },
  onReachBottom() {
    if (this.pageNumber < this.totalPage) {
      this.pageNumber = this.pageNumber + 1;
      this.findAd();
    }
  },
  methods: {
    init() {
      this.pageNumber = 1;
      this.adData = [];
      this.findAd();
    },
    handleStop(item, value) {
      uni.showModal({
        title: "暂停广告",
        content: `确定暂停${item.adName}?`,
        success: res => {
          if (res.confirm) {
            this.changeStatus(item, value);
          }
        }
      });
    },
    changeStatus(item, value) {
      let data = { adId: item.adId, adStatus: value };
      this.$http.data.changeAdStatus({
        data: data,
        success: re => {
          if (value == 1) {
            item.statusName = "进行中";
          } else if (value == 3) {
            item.statusName = "已暂停";
          }
          item.adStatus = value;
        },
        fail: () => {},
        complete: () => {}
      });
    },
    editAd(item) {
      uni.navigateTo({
        url: "/pages/addAd/addAd?adId=" + item.adId
      });
    },
    toAddAd() {
      uni.navigateTo({
        url: "/pages/addAd/addAd"
      });
    },
    findAd() {
      uni.showLoading({
        title: "加载中"
      });
      let data = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        params: { isCurrentUser: 1 }
      };
      this.$http.data.getAdList({
        data,
        success: res => {
          res.data.forEach(item => {
            if (item.adStatus == 0) {
              item.statusName = "未开始";
            } else if (item.adStatus == 1) {
              item.statusName = "进行中";
            } else if (item.adStatus == 2) {
              item.statusName = "已结束";
            } else if (item.adStatus == 3) {
              item.statusName = "已暂停";
            }
            this.adData.push(item);
          });
          this.totalPage = res.totalPage;
          uni.hideLoading();
        },
        complete: () => {
          uni.stopPullDownRefresh();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.adManage {
  background-color: #f1f1f1;
  min-height: 100%;
  .adManage1 {
    background-color: #ffffff;

    .item {
      margin-left: 25upx;
      margin-right: 25upx;
      border-bottom: 1upx solid #f1f1f1;
      .item_left {
        width: 550upx;
        float: left;
        .cost_line {
          line-height: 60upx;
          font-size: 26upx;
          color: #333333;
          .dailyLimit {
          }
          .cost {
            margin-left: 100upx;
          }
        }
        .name {
          color: #333333;
          font-size: 30upx;
          font-weight: bold;
          line-height: 60upx;
          margin-top: 20upx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .item_right {
        width: 150upx;
        text-align: center;
        float: left;
        color: #e5c393;
        line-height: 60upx;
        font-size: 30upx;
        font-weight: bold;
        margin-top: 20upx;
      }
      .op {
        width: 700upx;
        display: inline-block;
        margin-bottom: 10upx;
        .time {
          color: #999999;
          font-size: 26upx;
        }
        .opBtn {
          border: 1upx solid #e5c493;
          color: #e5c493;
          border-radius: 50upx;
          font-size: 26upx;
          display: inline-block;
          width: 150upx;
          text-align: center;
          height: 50upx;
          line-height: 50upx;
          margin-right: 10upx;
          float: right;
        }
        .edit {
          background-color: #e5c493;
          font-size: 26upx;
          width: 120upx;
          border-radius: 50upx;
          display: inline-block;
          height: 50upx;
          line-height: 50upx;
          text-align: center;
          color: #ffffff;
          float: right;
        }
        .edit_end {
          background-color: #e0e0e0;
          font-size: 26upx;
          width: 120upx;
          border-radius: 50upx;
          display: inline-block;
          height: 50upx;
          line-height: 50upx;
          text-align: center;
          color: #ffffff;
          float: right;
        }
      }
    }
    .add_ad {
      position: fixed;
      background-color: #e5c493;
      display: block;
      width: 500upx;
      height: 80upx;
      bottom: 120upx;
      text-align: center;
      color: #ffffff;
      border-radius: 50upx;
      margin-left: 125upx;
      font-size: 30upx;
      line-height: 80upx;
    }
    .minHeight {
      min-height: 120upx;
      display: inline-block;
      width: 750upx;
    }
  }
}
</style>
