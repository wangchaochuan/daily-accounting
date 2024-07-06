<template>
	<u-popup :show="visible" :closeable="true" :closeOnClickOverlay="false" :round="24" :z-index="8" @close="close"
		@open="open">
		<view class="content">
			<u-form labelPosition="left" :labelWidth="80" :model="book" ref="formRef">
				<u-form-item label="账本名称" prop="name" required>
					<u-input v-model="book.name" border="bottom" placeholder="请输入名称"></u-input>
				</u-form-item>
				<u-form-item label="账本类型" prop="type">
					<u-radio-group v-model="book.type" name="type" :disabled="mode==='edit'">
						<u-radio label="私人账本" name="private" customStyle="margin-right:16rpx"></u-radio>
						<u-radio label="共享账本" name="public"></u-radio>
					</u-radio-group>
				</u-form-item>
			</u-form>
			<view class="footer">
				<u-button type="primary" shape="circle" :loading="loading" @click="save">确定</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
	import {
		ref,
		watch,
		computed,
		onMounted,
		reactive
	} from 'vue'
	const CO = uniCloud.importObject("account-co");

	const props = defineProps({
		visible: {
			type: Boolean,
			default: false
		},
		mode: {
			type: String,
			default: "create"
		},
		data: {
			type: Object,
			default: () => ({})
		}
	})
	const emits = defineEmits(['close', 'success'])

	const formRef = ref(null)
	const loading = ref(false)
	const book = reactive({
		name: "",
		type: "private"
	})


	const rules = {
		name: [{
			type: 'string',
			required: true,
			message: '请输入账本名称',
			trigger: ['blur', 'change'],
		}]
	}

	const close = () => {
		book.name = '';
		book.type = 'private'
		emits('close')
	}
	const open = () => {
		if (props.mode === 'edit') {
			book.name = props.data.name;
			book.type = props.data.type;
		} else {
			book.name = '';
			book.type = 'private';
		}
	}
	const save = async () => {
		try {
			await formRef.value.validate()
			loading.value = true;
			if (props.mode === "create") {
				const user = uni.getStorageSync("user")
				await CO.createBook(book.name, user._id, book.type);
			} else {
				const id = props.data._id;
				const params = {
					...props.data,
					name: book.name
				}
				await CO.updateBook(id, params)
			}
			emits('success')
			close()
		} catch (e) {
			//TODO handle the exception
			console.log(e)
		} finally {
			loading.value = false
		}
	}
	onMounted(() => {
		formRef.value?.setRules(rules)
	})
</script>

<style lang="scss" scoped>
	.content {
		height: 360rpx;
		padding: 64rpx;
		display: flex;
		flex-direction: column;

		.avatar-container {
			height: fit-content;
			display: flex;
			justify-content: center;
		}

		.footer {
			margin-top: auto;
		}
	}
</style>