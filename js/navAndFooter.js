const body = document.querySelector('body');
const mainContent = document.querySelector('.main-content');
const mainCover = document.querySelector('.main-cover');
const burger = document.querySelector('.burger');
const navUl = document.querySelector('#navUl');
// the anchors are the tabbable elements
const navUlListAnchors = navUl.querySelectorAll('li a');
const searchInput = document.querySelector('#searchInput');
const searchIcon = document.querySelector('#search-btn');
const closeBtnSearch = document.querySelector('#search-close');

// prevent resize handler function being called too often
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// ---------------------------------------------- Nav toggle ---------------------------------------------------------//

// ----------------------------------------- nav search list  ------------------------------------------------------//

// Modified from: https://www.w3schools.com/howto/howto_js_filter_lists.asp
function searchFilter() {
  const filterRaw = DOMPurify.sanitize(searchInput.value, {
    FORBID_ATTR: ['width', 'height', 'style'],
    FORBID_TAGS: ['style'],
  });
  const filter = filterRaw.toUpperCase();
  const ul = document.querySelector('#searchUL');
  const li = ul.getElementsByTagName('li');

  if (searchInput.value === '') {
    ul.style.display = 'none';
  } else {
    ul.style.display = 'block';

    // Loop through all list items, and hide those that don't match the search query
    for (let i = 0; i < li.length; i += 1) {
      const a = li[i].getElementsByTagName('a')[0];
      const txtValue = a.innerText; // text of each list item (common and scientific name)
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        // if it is true (the substring {user input} occurs in the list item {name or scientific name})
        li[i].style.display = 'block';
      } else {
        li[i].style.display = 'none';
      }
    }
  }
}

const navSlide = () => {
  // close search input (if open)

  burger.addEventListener('click', () => {
    // close search input (if open)... same effect as clicking close for search box
    closeBtnSearch.style.display = 'none';
    searchIcon.style.display = 'block';
    searchInput.style.height = '0';
    searchInput.value = ''; // clear input
    searchFilter(); // to make UL display = none. (if user closes search when there are search results displayed)

    // toggle nav
    navUl.classList.toggle('nav-active');

    if (navUl.classList.contains('nav-active')) {
      navUl.style.animation = 'navSwipeOpen 0.5s ease-in';
      navUlListAnchors.forEach(li => {
        li.setAttribute('tabindex', 0);
      });
    } else {
      navUl.style.animation = 'navSwipeClose 0.5s ease-in';
      navUlListAnchors.forEach(li => {
        li.setAttribute('tabindex', -1);
      });
    }

    // burger animation
    burger.classList.toggle('close');

    // add opacity to main content
    mainContent.classList.toggle('background-fade');
    mainCover.classList.toggle('main-cover-opened');
    // remove scroll
    body.classList.toggle('remove-scroll');
  });
};

// call function
navSlide();

// check window size, if it is larger than 1000px, remove nav-active class from nav ul
// remove blur and close nav function
function removeBlurAndClose() {
  if (window.innerWidth > 1000) {
    navUl.classList.remove('nav-active');
    mainContent.classList.remove('background-fade');
    mainCover.classList.remove('main-cover-opened');
    body.classList.remove('remove-scroll');
    burger.classList.remove('close');
    navUl.style.animation = `navSwipeClose 0.5s ease-in`;
    // make navUlListAnchors un-tabbable
    navUlListAnchors.forEach(li => {
      li.setAttribute('tabindex', -1);
    });
  }
}

// close nav drop down when user clicks outside of nav (if nav-active)
function exitNav() {
  if (
    window.innerWidth <= 1000 &&
    navUl.classList.contains('nav-active') === true
  ) {
    navUl.classList.remove('nav-active');
    mainContent.classList.remove('background-fade');
    mainCover.classList.remove('main-cover-opened');
    body.classList.remove('remove-scroll');
    burger.classList.remove('close');
    navUl.style.animation = `navSwipeClose 0.5s ease-in`;
  }
}

function listTabIndexChange() {
  if (window.innerWidth > 1000) {
    navUlListAnchors.forEach(li => {
      li.setAttribute('tabindex', 0);
    });
  } else {
    navUlListAnchors.forEach(li => {
      li.setAttribute('tabindex', -1);
    });
  }
}

const resizeHandler = function() {
  removeBlurAndClose();
  listTabIndexChange();
};

// Listen for main content click
mainCover.addEventListener('click', exitNav);

// on window resize, call the remove blur and close nav function and list tab index change function
// window.onresize = resizeHandler;
window.addEventListener('resize', debounce(resizeHandler, 50));
// on page load - determine if li anchors should be tabbable based on window width
window.onload = listTabIndexChange;

// ------------------------------------------------- nav search  --------------------------------------------------------------//

let count = 0;
const messageEnglish = 'Search for a species';
const messageChinese = '尋找一個物種';
const speed = 100;
let message;

function typeWriter() {
  if (searchIcon.classList.contains('search-btn-zh')) {
    message = messageChinese;
  } else {
    message = messageEnglish;
  }

  if (count < message.length) {
    const msg = searchInput.getAttribute('placeholder') + message.charAt(count);
    searchInput.setAttribute('placeholder', msg);
    count += 1;
    setTimeout(typeWriter, speed);
  }
}

searchIcon.addEventListener('click', () => {
  searchIcon.style.display = 'none';
  closeBtnSearch.style.display = 'block';
  searchInput.style.height = '40px';
  searchInput.style.cursor = 'text';
  searchInput.setAttribute('tabindex', 0);
  searchInput.focus();
  typeWriter();
});

closeBtnSearch.addEventListener('click', () => {
  closeBtnSearch.style.display = 'none';
  searchInput.setAttribute('tabindex', -1);
  searchIcon.style.display = 'block';
  searchInput.style.height = '0';
  searchInput.value = ''; // clear input
  searchFilter(); // to make UL display = none. (if user closes search when there are search results displayed)
});

document.querySelector('#searchInput').addEventListener('keyup', searchFilter);

// ///////////////// footer ///////////
const footerImg = document.querySelector('.footer-img-container a video');

const observer = new IntersectionObserver(entries => {
  // console.log(entries);
  if (entries[0].intersectionRatio > 0) {
    entries[0].target.style.animation = `slideIn 2s forwards ease`;
  } else {
    entries[0].target.style.animation = 'none';
  }
});

observer.observe(footerImg);
