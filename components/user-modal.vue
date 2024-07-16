<template>
	<u-popup :show="visible" :closeable="true" :closeOnClickOverlay="false" :round="24" :z-index="8" @close="close">
		<view class="content">
			<view class="avatar-container">
				<u-avatar :src="src" class="avatar" size="84" @click="uploadAvatarImg"></u-avatar>
			</view>
			<u-form labelPosition="left" :model="user">
				<u-form-item label="昵称" prop="nick_name" required>
					<u-input v-model="user.nick_name" border="bottom" placeholder="请输入昵称"></u-input>
				</u-form-item>
			</u-form>
			<view class="footer">
				<u-button type="primary" shape="circle" :loading="loading" @click="save">保存</u-button>
			</view>
			<ksp-cropper mode="fixed" :width="200" :height="200" :url="url" @cancel="oncancel" @ok="onok"></ksp-cropper>
		</view>
	</u-popup>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		computed
	} from 'vue'

	const CO = uniCloud.importObject("account-co");

	const props = defineProps({
		visible: {
			type: Boolean,
			default: false
		},
	})
	const emits = defineEmits(['close', 'updateUser'])

	const formRef = ref(null)
	const loading = ref(false)
	const defaultUrl = "https://uview-plus.jiangruyi.com/h5/static/uview/album/noExist.jpg";
	const oldUser = uni.getStorageSync("user")
	const user = ref(oldUser);
	const avatar = ref(oldUser?.avatar)
	const src = computed(() => {
		return avatar.value?.url ? avatar.value.url : defaultUrl
	})
	// 头像裁剪
	const url = ref("")
	const oncancel = () => {
		url.value = ""
	}
	const onok = (e) => {
		url.value = ""
		avatar.value.url = e.path;
	}

	const rules = {
		nick_name: [{
			type: 'string',
			required: true,
			message: '请输入昵称',
			trigger: ['blur', 'change'],
		}]
	}

	const changeName = (value) => {
		user.nick_name = value;
	}

	const uploadAvatarImg = () => {
		const crop = {
			quality: 100,
			width: 600,
			height: 600,
			resize: true
		};
		uni.chooseImage({
			count: 1,
			crop,
			success: async (res) => {
				let tempFile = res.tempFiles[0],
					avatar_file = {
						// #ifdef H5
						extname: tempFile.name.split('.')[tempFile.name.split('.').length - 1],
						// #endif
						// #ifndef H5
						extname: tempFile.path.split('.')[tempFile.path.split('.').length - 1]
						// #endif
					},
					filePath = res.tempFilePaths[0]

				let cloudPath = user.value._id + '' + Date.now()
				avatar_file.name = cloudPath
				uni.showLoading({
					title: "更新头像中...",
					mask: true
				});
				let {
					fileID
				} = await uniCloud.uploadFile({
					filePath,
					cloudPath,
					fileType: "image"
				});
				avatar_file.url = fileID
				avatar.value = avatar_file;
				url.value = avatar_file.url;
				uni.hideLoading()
			}
		})
	}
	const close = () => {
		emits('close')
	}
	const save = async () => {
		try {
			// await formRef.value.validate()
			const params = {
				avatar: avatar.value,
				nick_name: user.value.nick_name
			}
			loading.value = true;
			await CO.updateUser(user.value._id, params)
			emits('updateUser', params)
			close()
		} catch (e) {
			//TODO handle the exception
		} finally {
			loading.value = false
		}
	}
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