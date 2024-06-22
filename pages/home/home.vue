<template>
	<view class="home">
		<view class="add" @click="add">
			<u-icon name="plus" color="#fff" :size="24"></u-icon>
		</view>
		<account-modal :visible="visible" @close="closeModal"></account-modal>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import AccountModal from '@/components/account-modal.vue'
	const visible = ref(false)
	const mode = ref('create')
	const add = () => {
		mode.value = 'create';
		visible.value = true;
	}
	const closeModal = () => {
		visible.value = false;
	}
	const text = ref('')
</script>

<style lang="scss">
	.home {
		.add {
			position: fixed;
			right: 32rpx;
			bottom: 160rpx;
			z-index: 8;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background-color: $u-primary;
		}
	}
</style>