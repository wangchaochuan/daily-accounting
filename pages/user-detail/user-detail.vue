<template>
	<view class="user">
		<view class="bg">
			<image :src="src" mode="aspectFill"></image>
		</view>
		<view class="avatar-container">
			<u-avatar :src="src" class="avatar" size="84"></u-avatar>
		</view>
		<view class="content">
			<view class="item" @click="handleCopy">
				<view class="label">ID:</view>
				<view class="value">
					<u-text :text="user._id"></u-text>
					<u-text text="复制" type="primary"></u-text>
				</view>
			</view>
			<view class="item">
				<view class="label">昵称:</view>
				<view class="value">
					<u-text :text="user.nick_name"></u-text>
				</view>
			</view>
			<view class="item">
				<view class="label">注册日期:</view>
				<view class="value">
					<u-text :text="user.register_date"></u-text>
				</view>
			</view>
		</view>
		<view class="edit">
			<u-button type="primary" shape="circle" @click="visible=true">编辑</u-button>
		</view>
		<user-modal :visible="visible" @close="visible=false" @update-user="updateUser" />
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		nextTick,
		onMounted
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import UserModal from "@/components/user-modal.vue"
	import useUserStore from '@/store/user.js';

	const userStore = useUserStore()
	const visible = ref(false)
	const user = computed(() => userStore.user)
	const defaultAvatarUrl = "https://uview-plus.jiangruyi.com/h5/static/uview/album/noExist.jpg";
	const src = computed(() => {
		if (user.value?.avatar?.url) {
			return user.value?.avatar?.url
		}
		return defaultAvatarUrl;
	})
	const updateUser = ({
		avatar,
		nick_name
	}) => {
		const newUser = {
			...user.value,
			avatar,
			nick_name
		}
		userStore.setUser(newUser)
	}
	const handleCopy = () => {
		uni.setClipboardData({
			data: user.value._id,
			success: function() {
				uni.showToast({
					title: '复制成功'
				});
			},
			fail: function(err) {
				uni.showToast({
					icon: 'none',
					title: '复制失败'
				});
			}
		});
	}
	onMounted(() => {
		uni.showLoading()
		const timer = setTimeout(() => {
			uni.hideLoading()
			clearTimeout(timer)
		}, 1800)
	})
</script>

<style lang="scss" scoped>
	.user {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 32rpx;
		box-sizing: border-box;

		.loading-container {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 88;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			background-color: rgba(0, 0, 0, 0.5);

			:deep(.u-loading-icon) {
				position: absolute;
				top: 50%;
				left: 50%;
				z-index: 99;
				transform: translate(-50%, -50%);
			}
		}

		.bg {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 6;
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

		.avatar-container {
			height: fit-content;
			display: flex;
			justify-content: center;
			margin-bottom: 32rpx;
		}

		.content {
			display: flex;
			flex-direction: column;

			.item {
				position: relative;
				z-index: 8;
				height: 56rpx;
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				.label {
					width: 200rpx;
					text-align: right;
					margin-right: 16rpx;
				}

				.value {
					flex: 1;
					display: flex;
					gap: 16rpx;
				}
			}
		}

		.edit {
			margin-top: 24rpx;
			position: relative;
			z-index: 8;
		}
	}
</style>