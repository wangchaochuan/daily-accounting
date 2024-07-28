<template>
	<view class="classify-list">
		<view v-for="(item,index) in list" :key="index" class="classify-item" :class="{'active':item===modelValue}"
			@click="changeClassify(item)">
			<view class="text">{{item}}</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	const props = defineProps({
		list: {
			type: Array,
			default: () => []
		},
		modelValue: {
			type: String,
			default: ''
		}
	})
	const emits = defineEmits('update:modelValue')
	const changeClassify = (value) => {
		emits('update:modelValue', value)
	}
</script>

<style lang="scss">
	.classify-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 16rpx;

		.classify-item {
			width: fit-content;
			min-width: 120rpx;
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 16rpx;
			background-color: $u-info-disabled;
			padding: 0 16rpx;
			box-sizing: border-box;

			&.active {
				background-color: $u-primary;
				color: #fff;
			}
		}
	}
</style>