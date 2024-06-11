// JS is enabled
document.querySelector('html').classList.add('js');

//
// Site search in dialog modal
//
const searchDialog = document.querySelector('.search-dialog');
const openSearch = document.querySelectorAll('.open-search');

openSearch.forEach((element) => {
  element.addEventListener('click', () => {
    searchDialog.showModal();
  });
});

searchDialog.addEventListener('click', (event) => {
  if (event.target === searchDialog) {
    searchDialog.close();
  }
});