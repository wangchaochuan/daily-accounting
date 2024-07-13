<script setup>
	import {
		onShow,
		onLaunch
	} from '@dcloudio/uni-app'
	import useMenuStore from '@/store/menu.js';
	import useUserStore from '@/store/user.js';
	import useBookStore from '@/store/book.js';

	const CO = uniCloud.importObject("account-co");
	const menuStore = useMenuStore()
	const userStore = useUserStore()
	const bookStore = useBookStore()

	onShow(() => {
		uni.getSystemInfo({
			success(result) {
				// #ifdef MP-WEIXIN
				// 获取手机系统的状态栏高度（不同手机的状态栏高度不同）  （ 不要使用uni-app官方文档的var(--status-bar-height) 官方这个是固定的20px  不对的 ）
				const statusBarHeight = result.statusBarHeight + 'px'
				// 获取右侧胶囊的信息 单位px
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
				//bottom: 胶囊底部距离屏幕顶部的距离
				//height: 胶囊高度
				//left:   胶囊左侧距离屏幕左侧的距离
				//right:  胶囊右侧距离屏幕左侧的距离
				//top:    胶囊顶部距离屏幕顶部的距离
				//width:  胶囊宽度
				const menuWidth = menuButtonInfo.width + 'px'
				const menuHeight = menuButtonInfo.height + 'px'
				const menuBorderRadius = menuButtonInfo.height / 2 + 'px'
				const menuRight = result.screenWidth - menuButtonInfo.right + 'px'
				const menuTop = menuButtonInfo.top + 'px'
				const contentTop = result.statusBarHeight + 44 + 'px'
				const menuInfo = {
					statusBarHeight: statusBarHeight, //状态栏高度----用来给自定义导航条页面的顶部导航条设计padding-top使用：目的留出系统的状态栏区域
					menuWidth: menuWidth, //右侧的胶囊宽度--用来给自定义导航条页面的左侧胶囊设置使用
					menuHeight: menuHeight, //右侧的胶囊高度--用来给自定义导航条页面的左侧胶囊设置使用
					menuBorderRadius: menuBorderRadius, //一半的圆角--用来给自定义导航条页面的左侧胶囊设置使用
					menuRight: menuRight, //右侧的胶囊距离右侧屏幕距离--用来给自定义导航条页面的左侧胶囊设置使用
					menuTop: menuTop, //右侧的胶囊顶部距离屏幕顶部的距离--用来给自定义导航条页面的左侧胶囊设置使用
					contentTop: contentTop, //内容区距离页面最上方的高度--用来给自定义导航条页面的内容区定位距离使用
				}
				menuStore.setMenu(menuInfo);
				// #endif
			}
		})
	})

	onLaunch(async () => {
		// #ifdef MP-WEIXIN
		const user = uni.getStorageSync("user");
		let userId = user?._id;
		// 缓存中已经有用户信息了,就不再需要从接口读取
		if (!userId) {
			const {
				code
			} = await uni.login({
				provider: "weixin"
			});
			if (!code) {
				return;
			}
			// 注册用户并返回注册的用户信息,如果已经注册过了不会重复注册
			const {
				data
			} = await CO.registerUser(code)
			userStore.setUser(data.user);
			userId = data.user._id;
		} else {
			userStore.setUser(user);
		}
		const books = uni.getStorageSync("books");
		let currentBookId = uni.getStorageSync("currentBookId");
		if (!books) {
			const response = await CO.getBooks(userId)
			if (Array.isArray(response.data)) {
				const list = response.data.map(v => {
					return {
						...v,
						members: v.members.map(m => ({
							id: m._id,
							name: m.nick_name,
							url: m.avatar?.url
						}))
					}
				})
				bookStore.setBooks(list);
				if (!currentBookId) {
					currentBookId = list?.[0]?._id;
				}
			}
		} else {
			bookStore.setBooks(books);
		}
		bookStore.setBookId(currentBookId)
		// #endif
	})
</script>

<style lang="scss">
	/*每个页面公共css */
	@import url('./static/font/iconfont.css');

	uni-page-body {
		height: 100%;
	}

	page {
		height: 100%;
	}
</style>