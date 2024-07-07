import {
	defineStore
} from 'pinia';
import {
	ref
} from 'vue';

const useBookStore = defineStore('book', () => {
	const books = ref([])
	const bookId = ref('')

	function setBooks(value) {
		books.value = value;
		uni.setStorageSync('books', value)
	}

	function setBookId(id) {
		bookId.value = id;
		uni.setStorageSync('currentBookId', id)
	}

	return {
		books,
		bookId,
		setBooks,
		setBookId,
	};
});

export default useBookStore