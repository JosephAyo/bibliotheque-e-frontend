export const iff = (condition, then, otherwise) => (condition ? then : otherwise);

export const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

export const bookSearch = (books = [], searchText = '') =>
  books.filter(
    (book) =>
      book.title.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
      book.author_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
      book.description.toLowerCase().indexOf(searchText.toLowerCase()) > -1
  );
