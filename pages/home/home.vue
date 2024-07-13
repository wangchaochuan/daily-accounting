<template>
	<view class="home">
		<navbar-home></navbar-home>
		<overview></overview>
		<scroll-view v-if="data.length>0" class="content" scroll-y>
			<date-card v-for="item in data" :key="item.key" :date="item.key" :data="item.data"></date-card>
		</scroll-view>
		<view class="empty" v-else>
			<u-empty text="暂无数据"></u-empty>
		</view>
		<view class="add" @click="add">
			<u-icon name="plus" color="#fff" :size="24"></u-icon>
		</view>
		<account-modal :visible="visible" mode="create" @close="visible=false" @success="init"></account-modal>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watchEffect
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import AccountModal from '@/components/account-modal.vue'
	import NavbarHome from '@/components/navbar_home.vue';
	import Overview from '@/components/overview.vue';
	import DateCard from "@/components/date-card.vue";
	import useBookStore from '@/store/book.js';


	const CO = uniCloud.importObject("account-co");
	const bookStore = useBookStore()
	const bookId = computed(() => bookStore.bookId)
	const startDay = computed(() => bookStore.startDay)
	const endDay = computed(() => bookStore.endDay)
	const visible = ref(false)
	const data = ref([])
	const add = () => {
		visible.value = true;
	}
	const init = async () => {
		if (!bookId.value) return;
		const params = {
			bookId: bookId.value,
			startDay: startDay.value,
			endDay: endDay.value
		}
		const response = await CO.getRecordList(params);
		const map = {};
		response.data.forEach(v => {
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
	watchEffect(() => {
		init()
	})
	onShow(() => {
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

		.empty {
			width: 100%;
			flex: 1;
			margin-top: 16rpx;
			padding: 0 32rpx;
			margin-bottom: 32rpx;
			box-sizing: border-box;
			overflow-y: auto;
			display: flex;
			align-items: center;
			justify-content: center;
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