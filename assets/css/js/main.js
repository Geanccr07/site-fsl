<script>
  const cards = document.querySelectorAll('.mentor-card');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  let currentIndex = 0;

  function showCard(index) {
    cards.forEach(card => card.classList.add('hidden'));
    cards[index].classList.remove('hidden');
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    showCard(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  });
</script>
