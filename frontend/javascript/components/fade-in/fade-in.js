const fadeInElements = document.querySelectorAll('.animate-fade-in');

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: [0.2]
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.intersectionRatio > 0.2) {
      entry.target.classList.add('in-viewport');
    }
  })
}, observerOptions);

for(const element of fadeInElements) {
  observer.observe(element);
}
