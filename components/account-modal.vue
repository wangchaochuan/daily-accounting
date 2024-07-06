<template>
	<u-popup :show="visible" :closeable="true" :closeOnClickOverlay="false" :round="24" @close="close">
		<view class="content">
			<view class="title">{{mode==='create'?'新增账目':'修改账目'}}</view>
			<view class="type">
				<u-radio-group v-model="type" name="type" @change="changeType">
					<u-radio label="支出" name="expend" customStyle="margin-right:16rpx"></u-radio>
					<u-radio label="收入" name="income"></u-radio>
				</u-radio-group>
			</view>
			<view class="classify">
				<view class="label">选择分类</view>
				<classify-component :list="classifyList" v-model="classify"></classify-component>
			</view>
			<u-form labelPosition="left" :model="model" :rules="rules" ref="formRef">
				<u-form-item label="日期" prop="date" required>
					<u-datetime-picker :has-input="true" mode="date" v-model="model.date" :min-date="minDate"
						:max-date="today"></u-datetime-picker>
				</u-form-item>
				<u-form-item label="金额" prop="amount" required>
					<u-input type="digit" placeholder="请输入金额" v-model="model.amount"></u-input>
				</u-form-item>
				<u-form-item label="标签" prop="tag">
					<u-input placeholder="请输入标签" v-model="model.tag"></u-input>
				</u-form-item>
				<u-form-item label="备注" prop="remark">
					<u-input placeholder="请输入备注" v-model="model.remark"></u-input>
				</u-form-item>
			</u-form>
			<view class="footer">
				<u-button class="cancel" type="error" shape="circle" :hairline="false" @click="cancel">取消</u-button>
				<u-button class="confirm" type="primary" shape="circle" :hairline="false" @click="confirm">确定</u-button>
			</view>
		</view>
	</u-popup>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import dayjs from 'dayjs'
	import classifyComponent from './classify.vue';
	import {
		expendClassifyList,
		incomeClassifyList
	} from '@/utils/data.js'
	const props = defineProps({
		visible: {
			type: Boolean,
			default: false
		},
		mode: {
			type: String,
			default: 'create'
		}
	})
	const emits = defineEmits(['close'])
	const type = ref('expend')
	const changeType = (value) => {
		if (value === 'expend') {
			classifyList.value = expendClassifyList;
			classify.value = expendClassifyList[0].text;
		} else {
			classifyList.value = incomeClassifyList;
			classify.value = incomeClassifyList[0].text;
		}
	}
	const classifyList = ref(expendClassifyList)
	const classify = ref(expendClassifyList[0].text)
	const today = dayjs().valueOf()
	const minDate = dayjs().subtract(3, 'year').valueOf()
	const formRef = ref(null)
	const model = reactive({
		date: today,
		amount: undefined,
		tag: '',
		remark: ''
	})
	const rules = {
		amount: [{
			type: 'number',
			required: true,
			message: '请输入金额',
			trigger: ['blur', 'change'],
		}]
	}

	const close = () => {
		emits('close')
	}

	const cancel = () => {
		close()
	}
	const reset = () => {
		model.date = today;
		model.amount = undefined;
		model.tag = '';
		model.remark = '';
	}
	const confirm = async () => {
		await formRef.value?.validate()
		const params = {
			type: type.value,
			classify: classify.value,
			date: dayjs(model.date).format('YYYY-MM-DD'),
			amount: model.amount,
			tag: model.tag,
			remark: model.remark
		}
		console.log(params, 'params')

		reset()
		close()
	}

	onMounted(() => {
		formRef.value?.setRules(rules)
	})
</script>

<style lang="scss">
	.content {
		height: fit-content;
		min-height: 240rpx;
		padding: 0 24rpx 16px 16px;

		.title {
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 16rpx;
		}

		.type {
			margin-bottom: 16rpx;
		}

		.classify {
			margin-bottom: 16px;

			.label {
				color: $u-content-color;
				margin-bottom: 8rpx;
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