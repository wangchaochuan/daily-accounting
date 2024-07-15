<template>
	<view class="container">
		<view class="type">
			<u-radio-group v-model="type" name="type" @change="changeType">
				<u-radio label="支出分类" name="expend" customStyle="margin-right:16rpx"></u-radio>
				<u-radio label="收入分类" name="income"></u-radio>
			</u-radio-group>
		</view>
		<scroll-view class="content" scroll-y>
			<l-drag :list="list" :column="1" gridHeight="40px" ref="dragRef" @change="changeList">
				<template #grid="{active, content,oindex}">
					<view class="inner" :class="{active: active}">
						<u-text :text="content" line-height="32px"></u-text>
						<u-icon name="trash" color="#fa3534" @click="remove(oindex)"></u-icon>
					</view>
				</template>
			</l-drag>
		</scroll-view>
		<view class="footer">
			<u-button class="cancel" type="error" shape="circle" @click="showModal=true">添加分类</u-button>
			<u-button class="confirm" type="primary" shape="circle" @click="save">保存</u-button>
		</view>
	</view>
	<u-modal :show="showModal" title="添加分类" showCancelButton @cancel="showModal=false" @confirm="addClassify">
		<u-input placeholder="请输入分类名称" v-model="classifyName"></u-input>
	</u-modal>
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
	import useBookStore from '@/store/book.js';

	const db = uniCloud.database()
	const bookStore = useBookStore()
	const bookId = computed(() => bookStore.bookId)
	const dragRef = ref(null)
	const type = ref('expend')
	const showModal = ref(false)
	const classifyName = ref('')
	const expendClassify = ref([])
	const incomeClassify = ref([])
	const list = ref([])
	const newList = ref([])
	const changeType = (val) => {
		type.value = val
	}
	const changeList = val => {
		newList.value = val.map(v => v.content)
	}

	const remove = (index) => {
		if (dragRef.value && index >= 0) {
			dragRef.value.remove(index)
		}
	}
	const addClassify = () => {
		const name = classifyName.value
		const instance = dragRef.value
		if (name && instance && !list.value.includes(name) && !newList.value.includes(name)) {
			instance.push(name)
		}
		classifyName.value = ''
		showModal.value = false
	}

	const save = async () => {
		try {
			uni.showLoading({
				title: "保存中..."
			})
			const condition = {};
			if (type.value === 'expend') {
				condition.expendClassify = newList.value
			} else {
				condition.incomeClassify = newList.value
			}
			await db.collection("account-book").doc(bookId.value).update(condition);
			uni.switchTab({
				url: "/pages/user/user"
			})
		} catch (e) {
			//TODO handle the exception
		} finally {
			uni.hideLoading()
		}

	}


	const init = async () => {
		if (!bookId.value) return
		try {
			uni.showLoading({
				title: "加载中..."
			})
			const response = await db.collection("account-book").doc(bookId.value).get();
			const data = response?.result?.data?.[0];
			if (data) {
				expendClassify.value = data.expendClassify;
				incomeClassify.value = data.incomeClassify;
			}
		} catch (e) {
			//TODO handle the exception
		} finally {
			uni.hideLoading()
		}
	}

	watchEffect(() => {
		if (type.value === 'expend') {
			list.value = expendClassify.value
		} else {
			list.value = incomeClassify.value
		}
	})

	onShow(() => {
		init()
	})
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: fit-content;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		padding: 32rpx;
		box-sizing: border-box;
		background-color: #fff;

		.type {
			margin-bottom: 16rpx;
		}

		.content {
			flex: 1;

			.inner {
				display: flex;
				justify-content: space-between;
				background-color: $u-info-light;
				padding: 0 32rpx;
				border-radius: 32rpx;

				&.active {
					background-color: $u-info-dark;
				}
			}
		}

		.footer {
			display: flex;
			gap: 32rpx;
			margin-bottom: 32rpx;
		}
	}
</style>