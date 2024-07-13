<template>
	<view class="navbar">
		<view class="title">青牛记账</view>
		<view class="content">
			<view class="account" @click="showBookPicker=true">
				<view class="text">{{bookName}}</view>
				<text class="iconfont">&#xe64d;</text>
			</view>
			<!-- <view class="filter">
				<text class="iconfont">&#xe610;</text>
				<text class="text">筛选</text>
			</view> -->
		</view>
		<u-picker :show="showBookPicker" :columns="books" :defaultIndex="defaultIndex" keyName="name" title="选择账本"
			@cancel="closePicker" @confirm="confirmPicker"></u-picker>
	</view>

</template>

<script setup>
	import {
		ref,
		computed,
		watch,
	} from 'vue';
	import useMenuStore from '@/store/menu.js';
	import useBookStore from '@/store/book.js';
	
	const store = useMenuStore()
	const bookStore = useBookStore()
	const menuTop = computed(() => store.menu.menuTop)
	const menuHeight = computed(() => store.menu.menuHeight)

	const books = computed(() => [bookStore.books])
	const bookId = computed({
		get: () => bookStore.bookId,
		set: (val) => {
			bookStore.setBookId(val)
		}
	})
	const defaultIndex = computed(() => {
		const index = bookStore.books.findIndex(v => v._id === bookId.value)
		return [index]
	})
	const bookName = ref('');
	watch([books, bookId], ([list, id]) => {
		if (list?.[0] && id) {
			const book = list[0].find(v => v._id === id)
			bookName.value = book.name;
		}
	}, {
		immediate: true
	})

	const showBookPicker = ref(false)
	const confirmPicker = (data) => {
		const item = data.value[0];
		bookId.value = item._id;
		showBookPicker.value = false;
	}
	const closePicker = () => {
		showBookPicker.value = false;
	}
</script>

<style lang="scss" scoped>
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