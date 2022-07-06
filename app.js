const root = document.getElementById('root');
const searchBtn = document.querySelector('#search-btn');
const address = 'https://rickandmortyapi.com/api/character';
const charactersContainer = document.querySelector('#characters-wrap');
const input = document.querySelector('#search-input');
const loadMoreBtn = document.querySelector('.load-more');
let queryData;
loadMoreBtn.style.display = 'none';

let clickCounter = 0;
let idArray = [];
let idArrayReversed = [];
let rowCounter = 5;
let deleteBtnId;
let isItem = false;

let createRow = (value) => {
  value += 5;
  for (let i = value - 5; i < value; i++) {
    let character = document.createElement('div');
    character.id = 'character' + i;
    character.className = 'character';
    charactersContainer.appendChild(character);
    let img = document.createElement('img');
    img.id = 'character-img-' + i;
    character.appendChild(img);
    let btn = document.createElement('button');
    btn.id = 'remove-btn-' + i;
    btn.className = 'remove-btn';
    btn.innerHTML = 'Remove';
    character.appendChild(btn);
    img.style.display = 'none';
    btn.style.display = 'none';
    if (queryData) {
      btn.addEventListener('click', (e) => {
          deleteCharacter(queryData, e);
      });
    }
  }
};

createRow(0);

let render = () => {
  if (JSON.parse(localStorage.getItem('characters'))) {
    idArray = JSON.parse(localStorage.getItem('characters'));
    clickCounter = idArray.length;
    
    isItem = true;

    switch(clickCounter) {
      case 6: 
        createRow(5);
        break;
      case 11:
        createRow(10);
        break;
      case 16:
        createRow(15);
        break;
      default:
        break;
    }

  }
}
render();

fetch(address)
  .then((response) => response.json())
  .then((data) => {
    queryData = data;
    console.log(data.results);
    if (isItem) {
      idArrayReversed = [].concat(idArray).reverse();
      document.querySelector(`#character-img-${0}`).style.display = 'block';
      document.querySelector(`#remove-btn-${0}`).style.display = 'block';
      document.querySelector(`#character-img-${0}`).src = data.results[idArrayReversed[0]].image;
      for (let i = 1; i < clickCounter; i++) {
        document.querySelector(`#character-img-${i}`).style.display = 'block';
        document.querySelector(`#remove-btn-${i}`).style.display = 'block';
        document.querySelector(`#character-img-${i}`).src = data.results[idArrayReversed[i]].image;
      }
    } 
    searchBtn.addEventListener('click', () => {
      let res_id = -1;
      data.results.map((el) => {
        if (parseInt(input.value) === el.id) {
          res_id = el.id - 1;
        }
        if (input.value === el.name) {
          res_id = el.id - 1;
        }
        return res_id;
      });
      if (res_id === -1) {
        alert('Character not found');
      } else if (idArray.includes(res_id)) {
          alert('Character is already in the list')
      } else {
        idArray.push(res_id);
        if (clickCounter === 4 || clickCounter === 9 || clickCounter === 14) {
          loadMoreBtn.style.display = 'block';
        }
        if (clickCounter === 5 && charactersContainer.children.length === 5) {
          autoCreateRows(10);
        }
        if (clickCounter === 10 && charactersContainer.children.length === 10) {
          autoCreateRows(15);
        }
        if (clickCounter === 15 && charactersContainer.children.length === 15) {
          autoCreateRows(20);
        }
        if (clickCounter === 0) {
          document.querySelector(`#character-img-${clickCounter}`).style.display = 'block';
          document.querySelector(`#remove-btn-${clickCounter}`).style.display = 'block';
          document.querySelector(`#character-img-${clickCounter}`).src =
            data.results[idArray[0]].image;
        } else {
          idArrayReversed = [].concat(idArray).reverse();
          for (let i = 1; i <= clickCounter; i++) {
            document.querySelector(`#character-img-${i}`).style.display =
              'block';
            document.querySelector(`#remove-btn-${i}`).style.display = 'block';
            document.querySelector(`#character-img-${i}`).src = data.results[idArrayReversed[i]].image;
          }
          document.querySelector(`#character-img-${0}`).style.display = 'block';
          document.querySelector(`#remove-btn-${0}`).style.display = 'block';
          document.querySelector(`#character-img-${0}`).src = data.results[idArrayReversed[0]].image;
        }

        clickCounter++;
        let localStorageCharacters;
        if (!JSON.parse(localStorage.getItem('characters'))) {
          localStorageCharacters = []
        } else {
          localStorageCharacters = JSON.parse(localStorage.getItem('characters'));
        }
        // let localStorageCharacters = JSON.parse(localStorage.getItem("characters")) ?? [];
        localStorageCharacters.push(idArray[clickCounter - 1]);
        localStorage.setItem('characters', JSON.stringify(localStorageCharacters));
      }
    });
    removeBtns.forEach((el) => {
      el.addEventListener('click', (e) => {
        deleteCharacter(data, e);
      });
    });
  })
.catch((err) => console.log(err));

loadMoreBtn.addEventListener('click', function () {
  if (clickCounter === 5 || clickCounter === 10 || clickCounter === 15) {
    if (rowCounter === 5) {
      autoCreateRows(10);
    } else if (rowCounter === 10 && clickCounter === 10) {
      autoCreateRows(15);
    } else if (rowCounter === 15 && clickCounter === 15) {
      autoCreateRows(20);
    }
  }
});

let autoCreateRows = (a) => {
  createRow(clickCounter);
  rowCounter = a;
  window.scrollTo(0, document.body.scrollHeight);
  loadMoreBtn.style.display = 'none';
};

const removeBtns = document.querySelectorAll('.remove-btn');

function deleteCharacter(data, e) {
  let isRemove = confirm('Do you want to remove?');
  if (isRemove) {
    clickCounter--;
  deleteBtnId = parseInt(e.target.id.slice(-1));
  // idArray = idArray.filter(function (el) {
  //   console.log(el, idArrayReversed[deleteBtnId])
  //   return el !== idArrayReversed[deleteBtnId];
  // });
  deleteBtnId = clickCounter - deleteBtnId;
  idArray.splice(deleteBtnId, 1);
  
  idArrayReversed = [].concat(idArray).reverse();

  for (let i = 1; i < clickCounter; i++) {
    document.querySelector(`#character-img-${i}`).style.display = 'block';
    document.querySelector(`#remove-btn-${i}`).style.display = 'block';
    document.querySelector(`#character-img-${i}`).src = data.results[idArrayReversed[i]].image;
  }

  document.querySelector(`#character-img-${clickCounter}`).style.display = 'none';
  document.querySelector(`#remove-btn-${clickCounter}`).style.display = 'none';
  
  if (clickCounter > 0) {
    document.querySelector(`#character-img-${0}`).style.display = 'block';
    document.querySelector(`#remove-btn-${0}`).style.display = 'block';
    document.querySelector(`#character-img-${0}`).src = data.results[idArrayReversed[0]].image;
  }

  if (clickCounter === 0) {
    document.querySelector(`#character-img-${0}`).style.display = 'none';
    document.querySelector(`#remove-btn-${0}`).style.display = 'none';
    // document.querySelector(`#character-img-${0}`).src = data.results[idArrayReversed[0]].image;
  }

  let localStorageCharacters;
  if (!JSON.parse(localStorage.getItem('characters'))) {
    localStorageCharacters = []
  } else {
    localStorageCharacters = JSON.parse(localStorage.getItem('characters'));
  }
  // let localStorageCharacters = JSON.parse(localStorage.getItem("characters")) ?? [];
  localStorageCharacters.push(idArray[clickCounter - 1]);
  localStorage.removeItem('characters', JSON.stringify(localStorageCharacters));
  if (!JSON.parse(localStorage.getItem('characters'))) {
    localStorageCharacters = []
  } else {
    localStorageCharacters = JSON.parse(localStorage.getItem('characters'));
  }
  // localStorageCharacters = JSON.parse(localStorage.getItem("characters")) ?? [];
  for (let i = 0; i < clickCounter; i++) {
    localStorageCharacters.push(idArray[i]);
    localStorage.setItem('characters', JSON.stringify(localStorageCharacters));
  }
  }
  
}
