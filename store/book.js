import {
	defineStore
} from 'pinia';
import {
	ref,
	computed
} from 'vue';
import dayjs from 'dayjs'

const useBookStore = defineStore('book', () => {
	const books = ref([])
	const bookId = ref('')
	const selectMonth = ref(dayjs().format("YYYY-MM"))

	const currentBook = computed(() => {
		if (books.value.length === 0) return null;
		return books.value.find(v => v._id === bookId.value)
	})
	const startDay = computed(() => {
		return dayjs(selectMonth.value).startOf('M').valueOf()
	})
	const endDay = computed(() => {
		return dayjs(selectMonth.value).endOf('M').valueOf()
	})


	function setBooks(value) {
		books.value = value;
		uni.setStorageSync('books', value)
	}

	function setBookId(id) {
		bookId.value = id;
		uni.setStorageSync('currentBookId', id)
	}

	function setSelectMonth(month) {
		selectMonth.value = month;
	}

	return {
		books,
		bookId,
		selectMonth,
		setBooks,
		setBookId,
		setSelectMonth,
		currentBook,
		startDay,
		endDay
	};
});

export default useBookStore