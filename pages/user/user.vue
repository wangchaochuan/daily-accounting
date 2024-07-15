<template>
	<view class="user_page">
		<view class="bg">
			<image v-if="src" :src="src" mode="aspectFill"></image>
			<image v-else :src="defaultAvatar" mode="aspectFill"></image>
		</view>
		<view class="header">
			<view class="user">
				<u-avatar :src="src" class="avatar" size="42"></u-avatar>
				<u-text :text="username" class="username" size="18" bold></u-text>
			</view>
			<u-text text="每一笔都清晰，每一步都踏实。"></u-text>
			<u-text text="记账，让消费更明智。" size="18" type="primary" bold></u-text>
		</view>

		<view class="body">
			<view class="group">
				<view class="item" @click="jumpToUser">
					<view class="left"><text class="text">用户信息</text></view>
					<view class="right"><u-icon name="arrow-right" size="24" color="#555"></u-icon></view>
				</view>
				<view class="item" @click="jumpToBook">
					<view class="left"><text class="text">账本管理</text></view>
					<view class="right"><u-icon name="arrow-right" size="24" color="#555"></u-icon></view>
				</view>
				<view class="item" @click="jumpToClassify">
					<view class="left"><text class="text">分类管理</text></view>
					<view class="right"><u-icon name="arrow-right" size="24" color="#555"></u-icon></view>
				</view>
				<view class="item" @click="jumpToMonth">
					<view class="left"><text class="text">月度总结</text></view>
					<view class="right"><u-icon name="arrow-right" size="24" color="#555"></u-icon></view>
				</view>
				<!-- 功能后续开发 -->
				<!-- <view class="item">
					<view class="left"><text class="text">年度报告</text></view>
					<view class="right"><u-icon name="arrow-right" size="24" color="#555"></u-icon></view>
				</view> -->
				<view class="item" @click="jumpToAbout">
					<view class="left"><text class="text">关于我们</text></view>
					<view class="right"><u-icon name="arrow-right" size="24" color="#555"></u-icon></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import useUserStore from '@/store/user.js';

	const userStore = useUserStore()
	const user = computed(() => userStore.user)
	const defaultAvatarUrl = "https://uview-plus.jiangruyi.com/h5/static/uview/album/noExist.jpg";
	// const defaultAvatar = "https://uview-plus.jiangruyi.com/h5/static/uview/album/6.jpg";
	const src = computed(() => {
		if (user.value?.avatar?.url) {
			return user.value?.avatar?.url
		}
		return defaultAvatarUrl;
	})
	const username = computed(() => user.value.nick_name);

	const navigate = (url) => {
		uni.navigateTo({
			url
		})
	}

	const jumpToUser = () => {
		navigate('/pages/user-detail/user-detail')
	}
	const jumpToBook = () => {
		navigate(`/pages/book/book?userId=${user.value._id}`)
	}
	const jumpToClassify = () => {
		navigate(`/pages/classify/classify`)
	}
	const jumpToMonth = () => {
		navigate('/pages/month-summary/month-summary')
	}
	const jumpToAbout = () => {
		navigate('/pages/about/about')
	}
</script>

<style lang="scss" scoped>
	.user_page {
		width: 100%;
		height: 100%;
		padding: 32rpx;
		box-sizing: border-box;

		.header {
			position: relative;
			z-index: 8;
			display: flex;
			flex-direction: column;
			gap: 18rpx;

			.user {
				display: flex;
				align-items: center;
				gap: 24rpx;

				.tip {
					justify-self: flex-end;
					display: flex;
					justify-content: flex-end;
				}
			}
		}

		.body {
			margin-top: 32rpx;

			.group {
				padding: 15rpx 0;

				.item {
					position: relative;
					z-index: 8;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 25rpx 0;
					font-size: 36rpx;
					color: #555;

					.left {
						display: flex;
						align-items: center;

						.iconfont {
							font-size: 38rpx;
							margin-right: 10rpx;
						}
					}

					.right {
						.iconfont {
							font-size: 26rpx;
						}
					}
				}


			}
		}
	}

	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
			filter: blur(20px);
			transform: scale(2);
			opacity: 0.5;
		}
	}
</style>