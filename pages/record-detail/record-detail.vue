<template>
	<view class="record-detail">
		<view class="body">
			<view class="item">
				<view class="label">分类:</view>
				<view class="value">{{data.classify}}</view>
			</view>
			<view class="item">
				<view class="label">日期:</view>
				<view class="value">{{data.date}}</view>
			</view>
			<view class="item">
				<view class="label">金额:</view>
				<view class="value">
					<u-text mode="price" bold :size="16" :text="data.amount" line-height="38px"></u-text>
				</view>
			</view>
			<view class="item" v-if="data.tag">
				<view class="label">标签:</view>
				<view class="value">{{data.tag}}</view>
			</view>
			<view class="item" v-if="data.remark">
				<view class="label">备注:</view>
				<view class="value">{{data.remark}}</view>
			</view>
			<view class="item">
				<view class="label">记录人:</view>
				<view class="value">{{getUpdater(data.updater)}}</view>
			</view>
			<view class="item">
				<view class="label">记录日期:</view>
				<view class="value">
					<u-text mode="date" :text="data.updateTimee" line-height="38px"></u-text>
				</view>
			</view>
		</view>
		<view class="footer">
			<u-button class="cancel" type="error" shape="circle" @click="showDeleteModal=true">删除</u-button>
			<u-button class="confirm" type="primary" shape="circle" @click="visible=true">编辑</u-button>
		</view>
		<u-modal :show="showDeleteModal" :title="title" content="删除后数据将无法找回,请谨慎操作" showCancelButton asyncClose
			@confirm="deleteRecord" @cancel="showDeleteModal=false"></u-modal>
		<account-modal :visible="visible" :data="data" mode="edit" @close="visible=false"
			@success="init(data._id)"></account-modal>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import useBookStore from '@/store/book.js';
	import AccountModal from '@/components/account-modal.vue'

	const CO = uniCloud.importObject("account-co");
	const bookStore = useBookStore()
	const currentBook = computed(() => bookStore.currentBook)
	const data = ref({})
	const visible = ref(false)
	const showDeleteModal = ref(false)

	const getUpdater = (id) => {
		if (!id || !currentBook.value?.members?.length) return ""
		const user = currentBook.value.members.find(v => v.id === id)
		return user?.name || "";
	}
	const deleteRecord = async () => {
		await CO.deleteRecord(data.value._id)
		uni.$emit('changeMonthTotal', {
			type: data.value.type,
			amount: 0 - data.value.amount
		})
		showDeleteModal.value = false;
		uni.switchTab({
			url: "/pages/home/home"
		})
	}

	const init = async (id) => {
		const response = await CO.getRecordById(id);
		data.value = response.data;
	}

	onLoad((options) => {
		const id = options.id;
		init(id)
	})
</script>

<style scoped lang="scss">
	.record-detail {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 32rpx;
		padding-bottom: 64rpx;
		box-sizing: border-box;

		.body {
			flex: 1;

			.item {
				height: 38px;
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;
				background-color: $u-info-disabled;
				border-radius: 38px;

				.label {
					width: 180rpx;
					text-align: right;
					margin-right: 16rpx;
					color: $u-tips-color;
				}

				.value {
					color: $u-main-color;
				}
			}
		}

		.footer {
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16rpx;
			margin-top: 36rpx;
		}
	}
</style>