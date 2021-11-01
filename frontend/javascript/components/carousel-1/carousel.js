/**
 * @typedef {Object} ApplySwipeActionProps
 * @property {HTMLElement} targetElement The target dom element to apply swipe actions to.
 * @property {Function} left Callback function after the user swipes left over the dom element.
 * @property {Function} right Callback function after the user swipes left over the dom element.
 */

/**
 * Applies directional swipe events to a dom element.
 * @param {ApplySwipeActionProps} param0
 */
function applySwipeAction({ targetElement, left, right }) {
  const swiper = {
    parameters: {
      left,
      right
    },
    states: {
      touchstartX: 0,
      touchendX: 0
    },
    handleGesture() {
      if (this.states.touchendX < this.states.touchstartX)
        this.parameters.left();
      if (this.states.touchendX > this.states.touchstartX)
        this.parameters.right();
    }
  }

  targetElement.addEventListener('touchstart', event => {
    swiper.states.touchstartX = event.changedTouches[0].screenX
  });

  targetElement.addEventListener('touchend', event => {
    swiper.states.touchendX = event.changedTouches[0].screenX;
    swiper.handleGesture();
  });

  return swiper;
}

/**
 * @typedef {Object} CreateCarouselProps
 * @property {HTMLElement} carouselElement The target element to apply carousel functionalities.
 * @property {Boolean} autoScroll Determines if auto scroll is enabled
 * @property {Number} autoScrollSpeed How long it takes before the carousel auto scrolls to the next image in ms.
 * @property {string} autoScrollDirection The direction of the auto scroll. Either 'left' or 'right'
 */

/**
 * Initializes carousel functionalities to a dom element.
 * The carousel element must have this sort of structure:
 *  <div class="carousel" id="my-carousel">
 *   <div class="previous-btn">Previous</div>
 *   <div class="next-btn">Next</div>
 *   <div class="carousel-navigator">
 *     <div class="carousel-btn" data-target="0">0</div>
 *     <div class="carousel-btn" data-target="1">1</div>
 *   </div>
 *   <div class="carousel-images">
 *     <div class="carousel-image active" data-index="0"></div>
 *     <div class="carousel-image" data-index="1"></div>
 *   </div>
 * </div>
 * @param {CreateCarouselProps} param0
 */
function createCarousel({ carouselElement, autoScroll=true, autoScrollSpeed=3000, autoScrollDirection='right' }) {
  const imageContainer = carouselElement.querySelector('.carousel-images');
  const images = imageContainer.querySelectorAll('.carousel-image');
  const initialImage = imageContainer.querySelector('.carousel-image.active');
  const navigator = carouselElement.querySelector('.carousel-navigator');
  const lastIndex = images.length - 1;
  const initialIndex = Number(initialImage.getAttribute('data-index'));

  const carousel = {
    imageContainer,
    images,
    initialImage,
    navigator,
    configs: {
      autoScroll,
      autoScrollSpeed,
      autoScrollDirection
    },
    constants: {
      initialIndex,
      lastIndex
    },
    states: {
      moving: false,
      currentIndex: initialIndex,
      currentAutoScrollTimeout: null,
      currentActveNavigatorButton: null
    },
    runAutoScrollEvent() {
      if(this.configs.autoScrollDirection == 'left') {
        this.states.currentAutoScrollTimeout = setTimeout(() => {
          this.movePrevious();
        }, this.configs.autoScrollSpeed);
      }
      else {
        this.states.currentAutoScrollTimeout = setTimeout(() => {
          this.moveNext();
        }, this.configs.autoScrollSpeed);
      }
    },
    setNavigatorState() {
      const currentIndex = this.states.currentIndex;
      const carouselButton = this.navigator.querySelector(`.carousel-btn[data-target="${currentIndex}"]`);
      carouselButton.classList.add('active');
      if(this.states.currentActveNavigatorButton) {
        this.states.currentActveNavigatorButton.classList.remove('active');
      }
      this.states.currentActveNavigatorButton = carouselButton;
    },
    onScroll() {
      this.moving = true;
      if(this.configs.autoScroll) {
        // reset timeouts regardless if the scroll was triggered by automation or not
        clearTimeout(this.states.currentAutoScrollTimeout);
        this.runAutoScrollEvent();
      }

      this.setNavigatorState();

      setTimeout(() => {
        this.clean();
        this.moving = false;
      }, 300);
    },
    clean() {
      const relevantImages = this.getRelevantImages(this.states.currentIndex);
      const skippedIndices = [
        relevantImages.indexes.previousIndex,
        this.states.currentIndex,
        relevantImages.indexes.nextIndex
      ];

      for(let i = 0; i <= this.constants.lastIndex; i++) {
        if(skippedIndices.includes(i))
          continue;
        const image = this.imageContainer.querySelector(`.carousel-image[data-index="${i}"]`);
        if(image) {
          image.classList.remove('backstage', 'prev', 'next', 'exit-stage', 'active');
        }
      }

      relevantImages.previousImage.classList.remove('backstage', 'next', 'exit-stage', 'active', 'force-prev', 'force-next');
      relevantImages.nextImage.classList.remove('backstage', 'prev', 'exit-stage', 'active', 'force-prev', 'force-next');
    },
    getPreviousIndex(i) {
      return i == 0 ? this.constants.lastIndex : i - 1;
    },
    getNextIndex(i) {
      return i == this.constants.lastIndex ? 0 : i + 1;
    },
    getRelevantImages(targetIndex) {
      const previousIndex = this.getPreviousIndex(targetIndex);
      const nextIndex = this.getNextIndex(targetIndex);
      const previousImage = this.imageContainer.querySelector(`.carousel-image[data-index="${previousIndex}"]`);
      const currentImage = this.imageContainer.querySelector(`.carousel-image[data-index="${targetIndex}"]`);
      const nextImage = this.imageContainer.querySelector(`.carousel-image[data-index="${nextIndex}"]`);
      return {
        indexes: {
          previousIndex,
          nextIndex
        },
        previousImage,
        currentImage,
        nextImage
      }
    },
    resetZIndexing(carouselImage) {
      carouselImage.classList.remove('backstage', 'exit-stage');
    },
    movePrevious() {
      if(this.states.moving)
        return;

      const relevantImages = this.getRelevantImages(this.states.currentIndex);

      this.resetZIndexing(relevantImages.previousImage);
      this.resetZIndexing(relevantImages.currentImage);
      this.resetZIndexing(relevantImages.nextImage);

      relevantImages.currentImage.classList.add('exit-stage');
      relevantImages.nextImage.classList.add('backstage');

      relevantImages.previousImage.classList.remove('prev');
      relevantImages.previousImage.classList.add('active');
      relevantImages.currentImage.classList.remove('active');
      relevantImages.currentImage.classList.add('next');
      relevantImages.nextImage.classList.remove('next');

      this.states.currentIndex = relevantImages.indexes.previousIndex;
      const newPreviousIndex = this.getPreviousIndex(this.states.currentIndex);
      const newPreviousImage = this.imageContainer.querySelector(`.carousel-image[data-index="${newPreviousIndex}"]`);
      newPreviousImage.classList.add('prev');
      this.onScroll();
    },
    moveNext() {
      if(this.states.moving)
        return;

      const relevantImages = this.getRelevantImages(this.states.currentIndex);

      this.resetZIndexing(relevantImages.previousImage);
      this.resetZIndexing(relevantImages.currentImage);
      this.resetZIndexing(relevantImages.nextImage);

      relevantImages.previousImage.classList.add('backstage');
      relevantImages.currentImage.classList.add('exit-stage');

      relevantImages.nextImage.classList.remove('next');
      relevantImages.nextImage.classList.add('active');
      relevantImages.currentImage.classList.remove('active');
      relevantImages.currentImage.classList.add('prev');
      relevantImages.previousImage.classList.remove('prev');

      this.states.currentIndex = relevantImages.indexes.nextIndex;
      const newNextIndex = this.getNextIndex(this.states.currentIndex);
      const newNextImage = this.imageContainer.querySelector(`.carousel-image[data-index="${newNextIndex}"]`);
      newNextImage.classList.add('next');
      this.onScroll();
    },
    moveToIndex(targetIndex) {
      if(this.states.moving)
        return;

      if(targetIndex === this.states.currentIndex)
        return;

      const targetImage = this.imageContainer.querySelector(`.carousel-image[data-index="${targetIndex}"]`);
      if(!targetImage)
        return;

      const currentRelevantImages = this.getRelevantImages(this.states.currentIndex);
      const newRelevantImages = this.getRelevantImages(targetIndex);

      this.resetZIndexing(currentRelevantImages.previousImage);
      this.resetZIndexing(currentRelevantImages.currentImage);
      this.resetZIndexing(currentRelevantImages.nextImage);

      this.resetZIndexing(newRelevantImages.previousImage);
      this.resetZIndexing(newRelevantImages.currentImage);
      this.resetZIndexing(newRelevantImages.nextImage);

      currentRelevantImages.currentImage.classList.add('exit-stage');
      newRelevantImages.previousImage.classList.add('force-prev');
      newRelevantImages.nextImage.classList.add('force-next');

      if(this.states.currentIndex < targetIndex) {
        newRelevantImages.currentImage.classList.add('force-next');
      }
      else {
        newRelevantImages.currentImage.classList.add('force-prev');
      }

      setTimeout(() => {
        currentRelevantImages.previousImage.classList.remove('prev');
        currentRelevantImages.nextImage.classList.remove('next');
        newRelevantImages.previousImage.classList.add('prev');
        newRelevantImages.currentImage.classList.add('active');
        newRelevantImages.nextImage.classList.add('next');

        newRelevantImages.previousImage.classList.remove('force-next', 'force-prev');
        newRelevantImages.currentImage.classList.remove('force-next', 'force-prev');
        newRelevantImages.nextImage.classList.remove('force-next', 'force-prev');

        currentRelevantImages.currentImage.classList.remove('active');

        if(this.states.currentIndex < targetIndex) {
          currentRelevantImages.currentImage.classList.add('next');
        }
        else {
          currentRelevantImages.currentImage.classList.add('prev');
        }
      }, 10);

      this.states.currentIndex = targetIndex;
      this.onScroll();
    }
  }

  const previousIndex = carousel.getPreviousIndex(initialIndex);
  const nextIndex = carousel.getNextIndex(initialIndex);
  const initialPreviousImage = imageContainer.querySelector(`.carousel-image[data-index="${previousIndex}"]`);
  const initalNextImage = imageContainer.querySelector(`.carousel-image[data-index="${nextIndex}"]`);
  initialPreviousImage.classList.add('prev');
  initalNextImage.classList.add('next');

  const previousButton = carouselElement.querySelector('.previous-btn');
  const nextButton = carouselElement.querySelector('.next-btn');

  previousButton.addEventListener('click', event => {
    carousel.movePrevious();
  });

  nextButton.addEventListener('click', event => {
    carousel.moveNext();
  });

  const carouselButtons = navigator.querySelectorAll('.carousel-btn[data-target]');
  for(const carouselButton of [...carouselButtons]) {
    carouselButton.addEventListener('click', event => {
      const index = Number(carouselButton.getAttribute('data-target'));
      carousel.moveToIndex(index);
    });
  }

  // initialize autoscroll
  if(autoScroll)
    carousel.runAutoScrollEvent();

  // initialize navigator state
  carousel.setNavigatorState();

  // mobile swiper
  const swiper = applySwipeAction({
    targetElement: carouselElement,
    left: () => {
      carousel.moveNext();
    },
    right: () => {
      carousel.movePrevious();
    }
  })

  return { carousel, swiper };
}

// sample initialization
createCarousel({
  carouselElement: document.getElementById('my-carousel'),
  autoScroll: true,
  autoScrollSpeed: 3000
});
