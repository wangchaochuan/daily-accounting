<template>
	<view class="navbar">
		<view class="title">青牛记账</view>
		<view class="content">
			<view class="account">
				<view class="text">默认账本</view>
				<text class="iconfont">&#xe64d;</text>
			</view>
			<view class="filter">
				<text class="iconfont">&#xe610;</text>
				<text class="text">筛选</text>
			</view>
		</view>
	</view>

</template>

<script setup>
	import {
		computed
	} from 'vue'
	import useMenuStore from '@/store/menu.js'
	const store = useMenuStore()
	const menuTop = computed(() => store.menu.menuTop)
	const menuHeight = computed(() => store.menu.menuHeight)
</script>

<style lang="scss">
	.navbar {
		height: 220rpx;
		color: #fff;
		background-color: $u-primary;
		padding-top: v-bind(menuTop);
		padding-left: 32rpx;
		padding-right: 32rpx;

		.title {
			height: v-bind(menuHeight);
			display: flex;
			align-items: center;
			margin-bottom: 64rpx;
		}

		.content {
			height: 64rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.account {
				display: flex;
				align-items: center;
				padding: 16rpx 32rpx;
				background-color: $u-primary-disabled;
				border-radius: 32rpx;

				.text {
					margin-right: 8rpx;
				}
			}

			.filter {
				.text {
					margin-left: 8rpx;
				}
			}
		}
	}
</style>