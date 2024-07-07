import {
	defineStore
} from 'pinia';
import {
	ref
} from 'vue';

const useUserStore = defineStore('user', () => {
	const user = ref({})

	function setUser(value) {
		user.value = value;
		uni.setStorageSync('user', value)
	}

	return {
		user,
		setUser
	};
});

export default useUserStore