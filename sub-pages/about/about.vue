<template>
	<scroll-view class="about">
		<view class="text">
			青牛记账是一款功能相对齐全，使用有点便捷的记账类小程序，虽然开发小伙伴已经绞尽脑汁想要提高用户体验了，但是个人的力量终究是有限的，这个小程序肯定还是有许多需要改进的地方，欢迎每一个用户给开发者提供宝贵的意见和建议。
		</view>
		<!-- <view class="text">
			由于个人水平有限，如果分享的知识有什么不对的地方，请大家及时指出；同时大家对于本程序有什么意见或建议也欢迎在意见反馈里填写提交，或者直接联系本人
		</view> -->
		<!--二维码区域-->
		<!-- <view id="qrCodeView">
			<image src="https://mp-ab46a2a7-d28c-4b66-829a-a99b259ac741.cdn.bspapp.com/cloudstorage/wechat.jpeg"></image>
		</view> -->

		<!--开发者信息区域-->
		<view id="developerView">
			<view class="developerItemView">
				<view>开发者姓名</view>
				<view>{{developer.name}}</view>
			</view>
			<view class="developerItemView">
				<view>开发者QQ</view>
				<view>{{developer.QQ}}</view>
			</view>
			<view class="developerItemView">
				<view>开发者微信号</view>
				<view>{{developer.wx}}</view>
			</view>
			<view class="developerItemView">
				<view>开发者邮箱</view>
				<view>{{developer.eMail}}</view>
			</view>
			<!-- 			<view class="developerItemView">
				<view>开发者CSDN博客号</view>
				<view>{{developer.blog}}</view>
			</view> -->
		</view>

	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				developer: {
					name: "孤心独饮",
					QQ: "1980901451",
					wx: "guxin_duyin",
					eMail: "1980901451@qq.com",
					blog: "guxin_duyin"
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.about {
		padding-top: 32rpx;
	}

	.text {
		padding: 40rpx;
		padding-bottom: 0;
		color: $u-tips-color;
	}

	/*二维码区域*/
	#qrCodeView {
		width: 600rpx;
		margin: 20rpx auto 60rpx;
		text-align: center;
		font-size: 26rpx;
	}

	#qrCodeView>image {
		width: 600rpx;
		height: 818.5rpx;
	}

	/*开发者信息区域*/
	#developerView {
		margin-top: 32rpx;
		padding: 0 40rpx;
	}

	.developerItemView {
		padding-bottom: 30rpx;
	}

	.developerItemView>view:nth-child(1) {
		font-size: 30rpx;
		color: #87cefa;
		padding-bottom: 20rpx;
	}

	.developerItemView>view:nth-child(2) {
		font-size: 26rpx;
		color: #888;
	}
</style>