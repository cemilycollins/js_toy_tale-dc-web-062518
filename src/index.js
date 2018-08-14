const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const formInputs = toyForm.querySelectorAll('input')
const toyCollectionDiv = document.querySelector('#toy-collection')
let addToy = false

// YOUR CODE HERE
document.addEventListener("DOMContentLoaded", () => {
  toyForm.addEventListener('submit', addNewToy)
  addBtn.addEventListener('click', formToggle)
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(json => {
      json.forEach(element => {renderToy(element)})
    })
})

function formToggle() {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
  } else {
    toyForm.style.display = 'none'
  }
}

function addNewToy(event) {
  event.preventDefault()
  if (formInputs[0] && formInputs[1]) {
    fetch('http://localhost:3000/toys', {
      method: "post",
      body: JSON.stringify({
        name: formInputs[0].value,
        image: formInputs[1].value,
        likes: 0
      }),
      headers: {"Content-Type": "application/json"}
    }).then(res => res.json())
    .then(json => {
      formInputs[0].value = ""
      formInputs[1].value = ""
      renderToy(json)
    })
  } else {
    alert("Please enter both a name and an image to create a new toy!")
  }
}

function renderToy(element) {
  let div = document.createElement('div')
  let h2 = document.createElement('h2')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let likeBtn = document.createElement('button')

  div.classList.add("card")
  img.classList.add("toy-avatar")
  likeBtn.classList.add("like-btn")
  h2.innerText = element.name
  img.src = element.image
  p.innerText = `${element.likes} Likes`
  likeBtn.innerText = "Like <3"
  div.id = `toy-${element.id}`

  likeBtn.addEventListener('click', addLike)

  div.appendChild(h2)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(likeBtn)
  toyCollectionDiv.appendChild(div)
}

function addLike(e) {
  let id = e.currentTarget.parentNode.id.split("-")[1]
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(json => {
      let toy = json.find((element) => {return element.id == id})
      toy.likes += 1
      patchAndRenderData(toy)
    })

}

function patchAndRenderData(obj) {
  fetch(`http://localhost:3000/toys/${obj.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: obj.name,
      image: obj.image,
      likes: obj.likes
    })
  }).then(res => res.json())
  .then(json => {
    let thisDiv = document.querySelector(`#toy-${obj.id}`)
    thisDiv.querySelector('p').innerText = `${obj.likes} Likes`
  })
}


// OR HERE!
