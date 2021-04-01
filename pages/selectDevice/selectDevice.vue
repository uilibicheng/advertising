<template>
	<view class="selectDevice">
		<view class="top">
			<view class="area" @click="handleShowSelectArea">
				<text>{{selectedArea.name}}</text>
				<image src="../../static/arrow_up.png" />
			</view>
			<view class="searchInput">
				<image src="../../static/magnifyingglass.png" />
				<input v-model="searchKeyWord" class="searchKeyWord" placeholder="请输入终端名称" placeholder-class="placeholder" />
			</view>
			<view class="searchBtn" @click="search">搜索</view>
		</view>
		<view class="radio-wrap">
			<view>广告板式</view>
			<view class="radio" @click="handleSelectScreenType(2)">
				<image :src="deviceScreenType === 2 ? '/static/radio_selected.png':'/static/radio_unselected.png'" />
				<text :class="[deviceScreenType === 2 ? 'active-radio' : '']">横屏广告 (12:9)</text>
			</view>
			<view class="radio" @click="handleSelectScreenType(1)">
				<image :src="deviceScreenType === 1 ? '/static/radio_selected.png' : '/static/radio_unselected.png'" />
				<text :class="[deviceScreenType === 1 ? 'active-radio' : '']">竖屏广告 (12:9)</text>
			</view>
		</view>

		<view class="allSelect">
			<image @click="selectAll" class="image_select"  :src="selectedAll?'../../static/selected.png':'../../static/unselected.png'" ></image><text>全选（当前区域下所有终端）</text>
		</view>
		<scroll-view
			scroll-y
			scroll-with-animation
			@scrolltolower="loadMore"
			class="scroll"
			:style="{height: scrollHeight + 'px'}">
		 <view class="item_content" v-for="(item,index) in deviceList" :key="index">
			<view class="image">
				<image @click="selectItem(item)" :src="item.selected?'../../static/selected.png':'../../static/unselected.png'" class="image_img" ></image>
			 </view>
			 <view class="item">
				 <view class="item_top">
					 <image class="item_top_img" src="../../static/Cumulativetotal.png"></image>
				 </view>
				 <view class="item_name">
					 {{item.deviceName}}
				 </view>
				 <view class="location">
					 <image class="location_img" src="../../static/location.png"></image>
					 <text>{{item.fullAddress}}</text>
				 </view>
			 </view>
			</view>
		</scroll-view>
    <view class="next">
			<view class="tips">已选:{{selectDevice.length}}个终端</view>
			<view class="nextBtn" @click="next">下一步</view>
		</view> 

		<view class="modal-wrap" v-if="isShowSelectArea">
			<view class="modal-box">
				<view class="modal-title">请选择所在地区</view>
				<view class="select-place">
					<text
						class="place"
						v-for="(item, index) in selectedArr"
						:key="item.regionId"
						@click="cancelSelect(item, index)">
						{{index === 0 ? '已选' : ''}}{{item.name}}
					</text>
					<text class="place choose" v-if="!isCompleteSelect">请选择</text>
					<scroll-view
						scroll-y
						scroll-with-animation
						:scroll-into-view="scrollId"
						class="scroll">
						<view
							class="scroll-item"
							:id="['area' + item.regionId]"
							v-for="(item, index) in chooseList"
							:key="item.regionId">
							<view class="scroll-item-left" @click="handleSelectPlace(item, index)">
								<image :src="regionObj.regionId === item.regionId ? '../../static/selected.png' : '../../static/unselected.png'" />
								{{item.name}}
							</view>
							<view class="scroll-item-arrow" @click="choosePlace(item, index)" v-if="item.children && item.children.length">
								<image src="../../static/arrow.png" mode="" />
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="modal-footer">
					<view class="btn" @click="handleHideSelectArea">取消</view>
					<view :class="['btn', 'confirm-btn', isCompleteSelect ? 'active-btn' : '']" @click="confirmSelectPlace">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKeyWord: '',
				searchBtn:true,
				selectedAll:false,
				deviceList: [],
				selectDevice:[],
				oldSelectDevice:'',
				preEdit:'',
				deviceScreenType: 2, // 2 横屏 1 竖屏
				isShowSelectArea: false,
				isCompleteSelect: false,
				selectedArr: [],
				chooseList: [],
				proviceList: [],
				prevSelectedArr: [],
				isCurrentSelect: false,
				scrollId: '',
				regionObj: {
					regionId: null,
					name: '',
				},
				selectedArea: {
					regionId: null,
					name: '请选择地区',
				},
				pageObj: {
					pageNumber: 1,
					pageSize: 50,
				},
				totalPage: 0,
				scrollHeight: 0
			}
		},
		onLoad(option) {
			var oldSelectDevice = option.selectDeviceId;
			this.preEdit = option.preEdit;
			var that = this;
			that.getRegionPlace()
			if(oldSelectDevice!=null){
				that.oldSelectDevice = oldSelectDevice;
        let selectDevices = oldSelectDevice.split(",");
				selectDevices.forEach(function(item){
					that.selectDevice.push(parseInt(item))
				});
				this.searchBtn = false;
			}
			this.deviceList = [];
			this.findDevice();
		},

		mounted() {
			// 获取设备列表滚动高度
			let topHeight = this.getDomHeight('top')
			let radioHeight = this.getDomHeight('radio-wrap')
			let allSelectHeight = this.getDomHeight('allSelect')
			let nextHeight = this.getDomHeight('next')
			let windowHeight = uni.getSystemInfoSync().windowHeight
			this.scrollHeight = windowHeight - topHeight - radioHeight - allSelectHeight - nextHeight - 10
		},

		watch: {
			'regionObj.regionId'(value) {
				this.isCompleteSelect = !!value
			}
		},

		methods: {
			getDomHeight(className) {
				const query = uni.createSelectorQuery()
				let height = 0
				query.select('.'+className).boundingClientRect(data => {
					height = data.height
				}).exec();
				return height
			},
			getRegionPlace() {
				this.$http.data.getRegionTree({
					success: res => {
						this.proviceList = res.data
          	this.chooseList = res.data
					},
				})
			},
			handleShowSelectArea() {
				this.regionObj = {...this.selectedArea}
				this.getNewChooseList(true)
				this.isShowSelectArea = true
			},
			handleHideSelectArea() {
				this.selectedArr = [...this.prevSelectedArr]
				this.regionId = {
					regionId: null,
					name: ''
				}
				this.isShowSelectArea = false
			},
			confirmSelectPlace() {
				if (!this.isCompleteSelect) return
				this.selectedArea = {...this.regionObj}
				this.prevSelectedArr = [...this.selectedArr]
				this.handleHideSelectArea()
				this.search()
			},
			cancelSelect(data, index) {
				this.selectedArr = this.selectedArr.slice(0, index)
				this.isCurrentSelect = false
				this.getNewChooseList()
			},
			// 勾选地区
			handleSelectPlace(data, index) {
				this.regionObj = {
					regionId: data.regionId,
					name: data.name
				}
				let obj = {
					name: data.name,
					regionId: data.regionId,
					index,
				}
				// 判断是否在当前列表选择
				if (this.isCurrentSelect) {
					let index = this.selectedArr.length - 1
					this.selectedArr.splice(index, 1, obj)
				} else {
					this.selectedArr.push(obj)
				}
				this.isCurrentSelect = true
				this.$nextTick(function() {
					this.scrollIntoView(this.regionObj.regionId)
				})
			},
			// 选择下一地区
			choosePlace(data, index) {
				// 选择完后，继续选择当前列
				if (!data.children.length) {
					this.selectedArr.pop()
				}
				if (!this.selectedArr.length || data.regionId !== this.selectedArr[this.selectedArr.length - 1].regionId) {
					this.handleSelectPlace(data, index)
				}
				this.isCurrentSelect = false
				this.getNewChooseList()
			},
			getNewChooseList(isInitLoad = false) {
				let newArr = [...this.selectedArr]
				let list = [...this.proviceList]
				let prevIndex = null
				newArr.forEach((item, arrIndex) => {
					if (arrIndex === 0) {
						// 是否初始加载
						if (isInitLoad) {
							list = this.proviceList
							prevIndex = item.index
						} else {
							list = this.proviceList[item.index].children
						}
					} else {
						if (isInitLoad) {
							list = list[prevIndex].children
							prevIndex = item.index
						} else {
							if (list[item.index].children && list[item.index].children.length) {
								list = list[item.index].children
							}
						}
					}
				})
				this.regionObj = {...newArr[newArr.length - 1]}
				this.$nextTick(function() {
					this.scrollIntoView(list[0].regionId)
				})
				this.chooseList = list
			},
			scrollIntoView(id) {
				this.$nextTick(function() {
					this.scrollId = 'area' + id
				})
			},
			handleSelectScreenType(type) {
				this.deviceScreenType = Number(type)
				this.selectedAll = false
				this.selectDevice = []
				this.search()
			},
			search() {
				this.pageObj.pageNumber = 1
				this.deviceList = []
				this.findDevice()
			},
			selectAll(){
				this.selectDevice = [];
				var that = this;
				if(this.selectedAll){
					that.deviceList.forEach(function(item){
						item.selected = false;
					})
				}else{
					that.deviceList.forEach(function(item){
						item.selected = true;
						that.selectDevice.push(item.deviceId);
					})
				}
				this.selectedAll = !this.selectedAll;
				
			},
			next(){
				try {
					if(this.selectDevice.length==0){
            this.$toast('请选择投放设备')
						return ;
					}
				  uni.setStorageSync('advertiser_selectDevice', this.selectDevice);
					if(this.preEdit=="edit"){
						uni.navigateTo({
							url: '/pages/previewAd/previewAd'
						})
					}else{
						if(this.oldSelectDevice!=""){
							uni.navigateTo({
								url: '/pages/uploadFile/uploadFile?edit=edit'
							})
						}else{
							uni.navigateTo({
								url: '/pages/uploadFile/uploadFile'
							})
						}
					}
				} catch (e) {
				    // error
				}
			},
			selectItem(item){
				if(item.selected){
					for(var i=0;i<this.selectDevice.length;i++){
						if(this.selectDevice[i]==item.deviceId){
							this.selectDevice.splice(i,1);
							item.selected = !item.selected;
							return ;
						}
					}
				}else{
					this.selectDevice.push(item.deviceId);
					item.selected = !item.selected;
				}
			},
			findDevice() {
				let data = {...this.pageObj};
				data.params = { 
					deviceName: this.searchKeyWord,
					deviceScreenType: this.deviceScreenType,
					regionId: this.selectedArea.regionId,
				};
				this.$http.data.getDeviceList({
					data: data,
					success: res => {
            if(this.selectDevice.length>0){
              res.data.forEach(item => {
                if(this.selectDevice.includes(item.deviceId)){
                  item.selected = true;
                }else{
                  item.selected = false;
                }
                this.deviceList.push(item);
              });
              
            }else{
              res.data.forEach(item =>{
                item.selected = false;
                this.deviceList.push(item);
              });
            }
            this.totalPage = res.totalPage
					},
				});
			},
			loadMore() {
				if (this.pageObj.pageNumber < this.totalPage) {
					this.pageObj.pageNumber = this.pageObj.pageNumber + 1
					this.findDevice()
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.selectDevice {
		.top {
			width: 100%;
			height: 100upx;
			padding: 20rpx 40rpx 0;
			line-height: 100upx;
			display: inline-block;
			font-size: 26upx;
			box-sizing: border-box;;
			display: flex;

			.area {
				width: 200upx;
				height: 60upx;
				line-height: 60upx;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;


				image {
					width: 25upx;
					height: 20upx;
					float: right;
					display: inline-block;
					margin-top: 20upx;
				}
			}

			.searchInput {
				width: 320upx;
				height: 60upx;
				line-height: 60upx;
				border-radius: 50upx;
				background-color: #F1F1F1;
				margin-left: 30upx;
				float: left;

				.placeholder {
					font-size:26rpx;
					color: #B1B1B1;
				}

				image {
					width: 40upx;
					height: 40upx;
					float: left;
					margin-left: 20upx;
					margin-top: 10upx;
					margin-right: 10rpx;
				}

				input {
					padding-top: 10upx;
				}
			}

			.searchBtn {
				width: 150upx;
				height: 60upx;
				margin-left: 30upx;
				line-height: 60upx;
				float: left;
				border-radius: 50upx;
				color: #FFFFFF;
				font-size: 26upx;
				background-color: #E5C494;
				text-align: center;
			}
		}

		.radio-wrap {
			display: flex;
			font-size: 28rpx;
			color: #999999;
			padding: 22rpx 40rpx;
			box-sizing: border-box;
			border-top: 1px solid #E8E7E7;

			.radio {
				margin-left: 50rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 12rpx;
				}

				text {
					font-size:24rpx;
				}

				.active-radio {
					color: #000000;
				}
			}


		}

		.searchKeyWord{
			font-size: 30upx;
		}
		.pickerArea {
			position: fixed;
			bottom: 0;
			left: 0;
			font-size: 26upx;
			display: inline-block;
			width: 100%;
			z-index: 20;
			background-color: #FFFFFF;
			picker-view {
				width: 100%;
				height: 400rpx;
				margin-top: 20rpx;

			}

			.cannel {
				width: 355upx;
				text-align: left;
				display: inline-block;
				margin-left: 20upx
			}

			.sure {
				width: 355upx;
				text-align: right;
				display: inline-block;
				margin-right: 20upx;
			}

			.areaTop {
				width: 750upx;
				display: inline-block;
			}

			.item_p {
				line-height: 100rpx;
				text-align: center;
			}
		}

		.allSelect {
			height: 100upx;
			line-height: 100upx;
			background-color: #F1F1F1;
			color: #999999;
			font-size: 26upx;
			width: 750upx;
			display: inline-block;

			.image_select {
				width: 40upx;
				height: 40upx;
				float: left;
				display: inline-block;
				padding-top: 10upx;
				margin-top: 15upx;
				margin-left: 25upx;
			}

			text {
				height: 50upx;
				line-height: 50upx;
				margin-left: 20upx;
				color: #333333;
				text-align: left;
				float: left;
				display: inline-block;
				margin-top: 20upx;
			}
		}
		.image{
			width: 80upx;
			float: left;
			margin-left:25upx;
			min-height: 200upx;
			display: inline-block;
			float: left;
			.image_img{
				height: 40upx;
				width: 40upx;
				display: inline-block;
				margin-top: 80upx;
			}
		}
		.item{
			width: 620upx;
			display: inline-block;
			float: left;
			.item_top{
				
				float: left;
				font-size: 26upx;
				display: inline-block;
				.item_top_img{
					height: 100upx;
					width: 100upx;
					display: inline-block;
					padding-top: 10upx;
					margin-top: 15upx;
					margin-left: 5upx;
				}
			}
			.item_name{
				width: 450upx;
				float: left;
				font-size: 30upx;
				display: inline-block;
				margin-left:15upx;
				margin-top:35upx;
				font-weight: bold;
			}
			.location{
				width: 620upx;
				float: left;
				display: inline-block;
				font-size: 26upx;
				.location_img{
					width: 25upx;
					height: 30upx;
					display: inline-block;
					float: left;
				}
				text{
					min-height: 30upx;
					line-height: 30upx;
					margin-left: 20upx;
					color: #333333;
					text-align: left;
					float: left;
					display: inline-block;
					width: 570upx;
				}
			}
			
		}
		.item_content{
			border-bottom: 1upx solid #F1F1F1;
			display: inline-block;
		}
		.next{
			position: fixed;
			bottom: 50upx;
			z-index: 10;
			.tips{
				text-align: center;
				font-size: 28upx;
				font-weight:500;
				color: #000000;
				width: 750upx;
				margin-bottom: 22rpx;
				margin-right: 30upx;
			}
			.nextBtn{
				background-color: #E5C494;
				width: 450upx;
				height: 80upx;
				line-height: 80upx;
				display: inline-block;
				text-align: center;
				color: #FFFFFF;
				border-radius: 50upx;
				margin-left:150upx;
			}
		}

		.modal-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .6);
			z-index: 1000;

      .modal-box {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #ffffff;
        color: #E5C493;
        border-radius:30rpx 30rpx 0px 0px;

        .modal-title {
          margin-top: 40rpx;
          margin-left: 40rpx;
          font-size: 32rpx;
          font-weight: bold;
        }

        .select-place {
          padding: 30rpx 40rpx;
					padding-right: 0;
          box-sizing: border-box;

          .place {
            font-size: 28rpx;
            color: #333333;
            font-weight: bold;
            padding-bottom: 10rpx;
            border-bottom: 5rpx solid #ffffff;
            margin-right: 35rpx;
          }

          .choose {
            border-bottom: 5rpx solid #E5C493;
          }

          .scroll {
            width: 100%;
            height: 440rpx;
            margin-top: 40rpx;
            font-size: 28rpx;
            color: #333333;

            .scroll-item {
              padding: 20rpx 0;
							display: flex;
							justify-content: space-between;
							align-items: center;

							.scroll-item-left {
								display: flex;
								align-items: center;

								image {
									width: 28rpx;
									height: 28rpx;
									margin-right: 15rpx;
								}
							}

							.scroll-item-arrow {
								width: 100rpx;
								height: 44rpx;
								padding-right: 40rpx;
								text-align: right;

								image {
									width: 44rpx;
									height: 44rpx;
								}
							}
            }
          }

          .scroll-owner-item {
            font-weight: 500;
            height: 85rpx;
            border-bottom: 1px solid #F1F1F1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            image {
              width: 28rpx;
              height: 28rpx;
            }
          }

          .scroll-active-item {
            color: #E5C493;
            font-weight: bold;
          }

          .scroll-owner-item:last-child {
            border-bottom: unset;
          }
        }

        .modal-footer {
          width: 100%;
          height: 100rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #DEDEDE;

          .btn {
            height: 100%;
            line-height: 100rpx;
            text-align: center;
            flex: 1 0 auto;
            font-size: 32rpx;
          }

          .confirm-btn {
            color: rgba(255, 255, 255, .5);
            background: #E5C493;
          }

          .active-btn {
            color: #ffffff;
          }
        }
      }
    }
	}
</style>
