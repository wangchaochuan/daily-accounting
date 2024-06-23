<template>
	<view class="home">
		<navbar-home></navbar-home>
		<overview></overview>
		<view class="add" @click="add">
			<u-icon name="plus" color="#fff" :size="24"></u-icon>
		</view>
		<account-modal :visible="visible" :mode="mode" @close="closeModal"></account-modal>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import AccountModal from '@/components/account-modal.vue'
	import NavbarHome from '@/components/navbar_home.vue';
	import Overview from '@/components/overview.vue';

	const visible = ref(false)
	const mode = ref('create')
	const add = () => {
		mode.value = 'create';
		visible.value = true;
	}
	const closeModal = () => {
		visible.value = false;
	}
</script>

<style lang="scss">

	.home {
		height: 100%;
		background-color: $u-info-light;

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