<template>
	<view class="overview">
		<view class="background"></view>
		<view class="header">
			<view class="date" @click="showDatePicker=true">
				<view class="year">{{year}}年</view>
				<view class="month">
					<text class="text">{{month}}月</text>
					<u-icon name="arrow-down-fill" class="icon"></u-icon>
				</view>
			</view>
			<view class="expend">
				<view class="label">支出</view>
				<view class="value">
					<u-text mode="price" type="error" bold :size="16" text="2345.1"></u-text>
				</view>
			</view>
			<view class="income">
				<view class="label">收入</view>
				<view class="value">
					<u-text mode="price" type="success" bold :size="16" text="29345.1"></u-text>
				</view>
			</view>
		</view>
		<template v-if="budget>0">
			<view class="budget">
				<view class="origin">
					<view class="label">本月预算:</view>
					<view class="value">
						<u-text mode="price" type="primary" bold :size="16" text="23495.1"></u-text>
					</view>
				</view>
				<view class="rest">
					<view class="label">剩余预算:</view>
					<view class="value">
						<u-text mode="price" type="warning" bold :size="16" text="20345.1"></u-text>
					</view>
				</view>
			</view>
			<view class="progress">
				<view class="text">本月已用预算<text class="value">48%</text></view>
				<u-line-progress :percentage="48" height="8"></u-line-progress>
			</view>
		</template>
		<view class="set_budget" v-else @click="showModal=true">设置本月预算</view>
		<view class="surplus">
			<view class="label">本月结余:</view>
			<view class="value">
				<u-text mode="price" type="primary" bold :size="16" text="-23495.1"></u-text>
			</view>
		</view>
		<u-datetime-picker mode="year-month" :show="showDatePicker" v-model="date" :min-date="minDate"
			:max-date="maxDate" @cancel="showDatePicker=false" @confirm="changeDate"
			closeOnClickOverlay></u-datetime-picker>
		<u-modal :show="showModal" title="设置预算" showCancelButton @cancel="showModal=false" @confirm="changeBudget">
			<u-input type="digit" placeholder="请输入预算" v-model="new_budget"></u-input>
		</u-modal>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import dayjs from 'dayjs'
	const today = dayjs();
	const maxDate = today.valueOf();
	const minDate = today.subtract(3, 'year').valueOf()
	const showDatePicker = ref(false)
	const year = ref(today.year())
	const month = ref(today.month() + 1)
	const date = ref(maxDate)
	const changeDate = () => {
		const time = dayjs(date.value);
		year.value = time.year()
		month.value = time.month() + 1
		showDatePicker.value = false
	}

	const budget = ref(0)
	const showModal = ref(false)
	const new_budget = ref()
	const changeBudget = () => {
		if (new_budget.value > 0) {
			budget.value = new_budget.value
		}
		showModal.value = false
	}
</script>

<style lang="scss">
	.overview {
		position: relative;
		height: fit-content;
		background-color: #fff;
		border-radius: 36rpx;
		margin-left: 32rpx;
		margin-right: 32rpx;
		padding-bottom: 32rpx;
		box-sizing: border-box;

		.background {
			width: 100vw;
			height: 100rpx;
			position: absolute;
			top: 0;
			left: -32rpx;
			background-color: $u-primary;
		}

		.header {
			height: 120rpx;
			position: relative;
			display: flex;
			background-color: #fff;
			border-radius: 36rpx 36rpx 0 0;
			z-index: 8;
			margin-bottom: 16rpx;

			.date {
				flex: 1;
				padding: 32rpx 0 0 32rpx;

				.year {
					font-size: 28rpx;
					color: $u-content-color;
				}

				.month {
					display: flex;

					.text {
						margin-right: 8rpx;
						font-weight: bold;
					}
				}
			}

			.expend,
			.income {
				flex: 1;
				padding-top: 32rpx;

				.label {
					font-size: 28rpx;
					color: $u-content-color;
				}
			}


		}

		.budget {
			height: fit-content;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			padding: 0 32rpx;

			.origin,
			.rest {
				display: flex;

				.label {
					font-size: 28rpx;
					color: $u-content-color;
					margin-right: 8rpx;
				}

			}
		}

		.progress {
			margin-top: 8rpx;
			padding: 0 32rpx;

			.text {
				font-size: 28rpx;
				color: $u-content-color;
				margin-bottom: 4rpx;

				.value {
					color: $u-primary;
					margin-left: 8rpx;
				}
			}
		}

		.set_budget {
			padding: 0 32rpx;
		}

		.surplus {
			display: flex;
			margin-top: 16rpx;
			margin-right: 8rpx;
			padding: 0 32rpx;

			.label {
				font-size: 28rpx;
				color: $u-content-color;
				margin-right: 8rpx;
			}
		}
	}
</style>