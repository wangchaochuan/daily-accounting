<template>
	<view class="container">
		<view class="invite">
			<view class="body">
				<view style="margin-bottom: 8px;">
					<text class="text">您的好友</text>
					<text class="user">{{userName}}</text>
					<text class="text">邀请您使用青牛记账,并加入共享账本:</text>
					<text class="book">{{bookName}}</text>
				</view>
				<u-text text="请确认是否加入?" bold type="warning" :size="20"></u-text>
			</view>
			<view class="footer">
				<u-button class="cancel" type="error" shape="circle" @click="cancel">暂不加入</u-button>
				<u-button class="confirm" type="primary" shape="circle" @click="confirm">立即加入</u-button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import useUserStore from '@/store/user.js';
	import useBookStore from '@/store/book.js';

	const CO = uniCloud.importObject("account-co");
	const userStore = useUserStore()
	const bookStore = useBookStore()
	const user = computed(() => userStore.user)
	const userName = ref('')
	const bookName = ref('')
	const bookId = ref('')
	const members = ref([])

	const cancel = () => {
		uni.switchTab({
			url: "/pages/home/home"
		})
	}

	const confirm = async () => {
		if (!members.value.includes(user.value._id)) {
			await CO.addBookMembers(bookId.value, user.value._id)
			bookStore.setBookId(bookId.value)
		}
		cancel()
	}

	onLoad((options) => {
		userName.value = options.userName;
		bookName.value = options.bookName;
		bookId.value = options.bookId;
		let users = options.members;
		if (typeof users === 'string') {
			try {
				users = JSON.parse(users)
			} catch (e) {
				//TODO handle the exception
				users = []
			}
		}
		members.value = users;
	})
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 32rpx;
		box-sizing: border-box;
		background-color: $u-info-light;

		.invite {
			width: 100%;
			height: fit-content;
			background-color: #fff;
			padding: 32rpx;
			box-sizing: border-box;
			border-radius: 32rpx;

			.body {
				height: fit-content;
				min-height: 200rpx;
				font-size: 32rpx;
				line-height: 48rpx;

				.text {
					color: $u-content-color;
				}

				.user,
				.book {
					font-weight: bold;
					margin: 0 8rpx;
				}

				.user {
					color: $u-main-color;
				}

				.book {
					color: $u-primary;
				}
			}

			.footer {
				display: flex;
				gap: 32rpx;
			}
		}
	}
</style>