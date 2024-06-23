import {
	defineStore
} from 'pinia';
import {
	ref
} from 'vue';

const useMenuStore = defineStore('menu', () => {
	const menu = ref({
		contentTop: "98px",
		menuBorderRadius: "16px",
		menuHeight: "32px",
		menuRight: "7px",
		menuTop: "58px",
		menuWidth: "87px",
		statusBarHeight: "54px",
	})

	function setMenu(value) {
		menu.value = value;
	}

	return {
		menu,
		setMenu
	};
});

export default useMenuStore