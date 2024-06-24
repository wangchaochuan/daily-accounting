<template>
	<view class="home">
		<navbar-home></navbar-home>
		<overview></overview>
		<scroll-view class="content" scroll-y>
			<date-card v-for="item in data" :key="item.key" :date="item.key" :data="item.data"></date-card>
		</scroll-view>
		<view class="add" @click="add">
			<u-icon name="plus" color="#fff" :size="24"></u-icon>
		</view>
		<account-modal :visible="visible" :mode="mode" @close="closeModal"></account-modal>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import AccountModal from '@/components/account-modal.vue'
	import NavbarHome from '@/components/navbar_home.vue';
	import Overview from '@/components/overview.vue';
	import DateCard from "@/components/date-card.vue";
	import {
		expendList
	} from '@/utils/mock.js'

	const visible = ref(false)
	const mode = ref('create')
	const data = ref([])
	const add = () => {
		mode.value = 'create';
		visible.value = true;
	}
	const closeModal = () => {
		visible.value = false;
	}
	const init = () => {
		const map = {};
		expendList.forEach(v => {
			if (!map[v.date]) {
				map[v.date] = []
			}
			map[v.date].push(v)
		})
		const list = Object.entries(map).map(([k, v]) => ({
			key: k,
			data: v
		}))
		data.value = list
	}
	onMounted(() => {
		init()
	})
</script>

<style lang="scss" scoped>
	.home {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: $u-info-light;
		overflow: hidden;

		.content {
			width: 100%;
			flex: 1;
			margin-top: 16rpx;
			padding: 0 32rpx;
			margin-bottom: 32rpx;
			box-sizing: border-box;
			overflow-y: auto;
		}

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

		.u-popup {
			flex: 0;
		}
	}
</style>