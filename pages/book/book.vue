<template>
	<view class="container">
		<scroll-view class="books" scroll-y>
			<view class="book" v-for="book in books" :key="book._id" :class="{'active':book._id===activeBook}">
				<view class="title">
					<view class="name">{{book.name}}</view>
					<view class="type">{{book.type==="private"?"私人账本":"共享账本"}}</view>
					<view class="selected" v-show="book._id===activeBook">默认账本</view>
				</view>
				<view class="body">
					<view class="label">当前成员:</view>
					<u-avatar-group :urls="getUrls(book)" size="36" gap="0.2"></u-avatar-group>
				</view>
				<view class="footer">
					<view class="delete" v-show="book._id!==activeBook && books.length>1">
						<u-button @click="showDeleteModal(book)">删除</u-button>
					</view>
					<view class="edit" v-if="book.creator===userId">
						<u-button @click="editBook(book)">编辑</u-button>
					</view>
					<view class="edit" v-if="book.creator!==userId && books.length>1">
						<u-button @click="quitBook(book)">退出</u-button>
					</view>
					<view class="invite" v-if="book.type==='public'">
						<u-button open-type="share" :dataName="book">邀请成员</u-button>
					</view>
					<view class="set" v-show="book._id!==activeBook">
						<u-button @click="setBook(book._id)">设为默认账本</u-button>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="footer">
			<u-button type="primary" shape="circle" @click="createBook">创建新的账本</u-button>
		</view>
		<u-modal :show="showModal" :title="title" content="删除后账本所有数据都将无法找回,请谨慎操作" showCancelButton asyncClose
			@confirm="deleteBook" @cancel="showModal=false"></u-modal>
		<book-modal :visible="showBookModal" :mode="mode" :data="editData" @close="showBookModal=false"
			@success="handleSuccess"></book-modal>

	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue';
	import {
		onLoad,
		onShareAppMessage
	} from '@dcloudio/uni-app';
	import BookModal from '@/components/book-modal.vue';
	import useUserStore from '@/store/user.js';
	import useBookStore from '@/store/book.js';

	const userStore = useUserStore()
	const bookStore = useBookStore()
	const CO = uniCloud.importObject("account-co");
	const books = computed({
		get: () => bookStore.books,
		set: (val) => {
			bookStore.setBooks(val)
		}
	})
	const activeBook = computed({
		get: () => bookStore.bookId,
		set: (val) => {
			bookStore.setBookId(val)
		}
	});
	const userId = computed(() => userStore.user._id)
	const userName = computed(() => userStore.user.nick_name)
	const bookId = ref("");
	const defaultAvatarUrl = "https://uview-plus.jiangruyi.com/h5/static/uview/album/noExist.jpg";
	const getUrls = (book) => {
		return book.members.map(v => v?.url || defaultAvatarUrl)
	}

	const showModal = ref(false)
	const title = ref("确认删除?")

	const showBookModal = ref(false);
	const mode = ref('create')
	const editData = ref({})


	const setBook = (id) => {
		activeBook.value = id;
	}

	const showDeleteModal = (book) => {
		showModal.value = true;
		title.value = `确认删除${book.name}？`
		bookId.value = book._id;
	}
	const editBook = (book) => {
		mode.value = 'edit';
		editData.value = book;
		showBookModal.value = true;
	}
	const createBook = () => {
		mode.value = 'create';
		showBookModal.value = true;
	}
	const quitBook = async (book) => {
		const id = book._id;
		const members = book.members;
		const index = members.findIndex(v => v.id === userId.value)
		if (index > -1) {
			members.splice(index, 1);
			const ids = members.map(v => v.id)
			await CO.updateBook(id, {
				members: ids
			})
			loadBooks(userId.value)
		}

	}
	const deleteBook = async () => {
		await CO.deleteBook(bookId.value)
		showModal.value = false
		loadBooks(userId.value)
	}

	const loadBooks = async (userId) => {
		if (!userId) {
			return;
		}
		const response = await CO.getBooks(userId)
		if (Array.isArray(response.data)) {
			books.value = response.data.map(v => {
				return {
					...v,
					members: v.members.map(m => ({
						id: m._id,
						name: m.nick_name,
						url: m.avatar?.url
					}))
				}
			})
			const index = response.data.findIndex(v => v._id === activeBook.value)
			if (index < 0) {
				activeBook.value = response.data?.[0]?._id;
			}
		}
	}

	const handleSuccess = () => {
		loadBooks(userId.value)
	}
	onMounted(() => {
		loadBooks(userId.value)
	})
	uni.showShareMenu({
		withShareTicket: true
	})
	onShareAppMessage((params) => {
		if (params.from === 'button') {
			const data = params.target.dataset.name;
			const bookName = data.name;
			const bookId = data._id;
			const members = JSON.stringify(data.members.map(v => v._id));
			return {
				title: `${userName.value}邀请您使用青牛记账，并加入共享账本:${bookName}`,
				path: `/pages/invite/invite?userName=${userName.value}&bookName=${bookName}&bookId=${bookId}&members=${members}`
			}
		} else {
			return {
				title: `${userName.value}邀请您使用青牛记账`,
				path: `/pages/home/home`
			}
		}
	})
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		padding: 32rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		.books {
			height: calc(100% - 96rpx);
			display: flex;
			flex-direction: column;

			.book {
				height: fit-content;
				padding: 32rpx;
				background-color: #fff;
				border: 1px solid $u-border-color;
				margin-bottom: 32rpx;

				&.active {
					border-color: $u-primary;
				}

				.title {
					height: fit-content;
					display: flex;
					align-items: center;
					margin-bottom: 32rpx;

					.name {
						font-size: 32rpx;
						margin-right: 16rpx;
					}

					.type {
						background-color: $u-info-dark;
						color: #fff;
						font-size: 24rpx;
						padding: 8rpx 16rpx;
						border-radius: 16rpx;
					}

					.selected {
						background-color: $u-primary;
						color: #fff;
						font-size: 24rpx;
						margin-left: auto;
						padding: 8rpx 16rpx;
						border-radius: 16rpx;
					}
				}

				.body {
					height: fit-content;
					display: flex;
					align-items: center;
					margin-bottom: 32rpx;

					.label {
						color: $u-tips-color;
						margin-right: 16rpx;
					}
				}

				.footer {
					height: fit-content;
					display: flex;
					gap: 16rpx;
				}
			}
		}

		.footer {
			height: 88rpx;
			margin-top: auto;
		}
	}
</style>