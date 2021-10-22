const rating = document.querySelector('.form-control-range')

function changeRatingColor() {
  const rate = Number(rating.value).toFixed(1)
  const colorHue = Math.round((rate - 1) * 124 / 4)
  const ratingNum = document.querySelector('.rating-num')

  ratingNum.style.color = `hsl(${colorHue}, 85%, 75%)`
  ratingNum.innerText = `${rate}`
}

changeRatingColor() //INITIALIZE
rating.addEventListener('input', changeRatingColor)