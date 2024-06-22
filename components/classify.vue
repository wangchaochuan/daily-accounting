<template>
	<view class="classify-list">
		<view v-for="item in list" :key="item.text" class="classify-item" :class="{'active':item.text===modelValue}"
			@click="changeClassify(item.text)">
			<view class="text">{{item.text}}</view>
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
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120rpx, 1fr));
		gap: 16rpx;

		.classify-item {
			width: 120rpx;
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 16rpx;
			background-color: $u-info-disabled;

			&.active {
				background-color: $u-primary;
				color: #fff;
			}
		}
	}
</style>