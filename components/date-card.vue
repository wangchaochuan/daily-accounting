<template>
	<view class="card">
		<view class="title">
			<view class="left">{{date}}</view>
			<view class="right">{{expend}}</view>
		</view>
		<view class="content">
			<view class="item" v-for="item in data" :key="item.id">
				<view class="left">
					<view class="classify">
						<text class="text">{{item.classify}}</text>
						<u-tag :text="item.tag" v-if="item.tag" plain size="mini" shape="circle"></u-tag>
					</view>
					<view class="remark" v-if="item.remark">{{item.remark}}</view>
				</view>
				<view class="right" :class="{'income':item.type==='income'}">
					￥{{item.amount}}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed
	} from 'vue'
	import dayjs from 'dayjs'
	const props = defineProps({
		date: {
			type: String,
			default: ''
		},
		data: {
			type: Array,
			default: () => []
		}
	})
	const date = computed(() => {
		const d = dayjs(props.date).day()
		const week = ['日', '一', '二', '三', '四', '五', '六']
		return `${props.date} (星期${week[d]})`
	})
	const expend = computed(() => {
		const expendList = props.data.filter(v => v.type === 'expend');
		let sum = 0;
		expendList.forEach(v => {
			sum += v.amount
		})
		return sum === 0 ? '' : `支出:￥${sum}`
	})
</script>

<style lang="scss">
	.card {
		width: 100%;
		margin-bottom: 16rpx;

		.title {
			height: 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				font-size: 28rpx;
				color: $u-content-color;
			}

			.right {
				font-size: 24rpx;
				color: $u-light-color;
			}
		}

		.content {
			height: fit-content;
			display: flex;
			flex-direction: column;
			margin-top: 8rpx;
			background-color: #fff;
			border-radius: 16rpx;
			box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);

			.item {
				height: fit-content;
				display: flex;
				padding: 16rpx 32rpx;
				border-bottom: 1px solid $u-border-color;

				.left {
					flex: 2;

					.classify {
						height: 48rpx;
						display: flex;
						align-items: center;

						.text {
							margin-right: 16rpx;
						}
					}

					.remark {
						height: 48rpx;
						display: flex;
						align-items: center;
						color: $u-light-color;
					}
				}

				.right {
					height: 100%;
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					align-self: center;
					color: $u-error-disabled;

					&.income {
						color: $u-success-disabled
					}
				}

				&:last-child {
					border-bottom: none;
				}
			}
		}

		:deep(.u-tag) {
			padding: 0 16rpx;
		}
	}
</style>