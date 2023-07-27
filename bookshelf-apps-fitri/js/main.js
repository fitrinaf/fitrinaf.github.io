const inputBukuBaru = document.querySelector('.tambahBuku');
const inputBuku = document.querySelector('.input_section');
const bookCancel = document.querySelector('#bookCancel');

inputBukuBaru.addEventListener('click', () => {
    inputBuku.style.display = "flex";
    resetBook()

})

bookCancel.addEventListener('click', () => {
    inputBuku.style.display = "none";
    resetBook()
})

function resetBook(){
  inputTitle.value= "";
  inputAuthor.value= "";
  inputYear.value= "";
}

const finish = [];
const rakBuku = 'rak-buku';


function generateId() {
  return +new Date();
}

function isiBuku(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function addBook () {
    const inputTitle = document.getElementById('inputTitle').value;
    const inputAuthor = document.getElementById('inputAuthor').value;
    const inputYear = document.getElementById('inputYear').value; 

    const generateID = generateId();
    const bookObject = isiBuku(generateID, inputTitle, inputAuthor, inputYear, false);
    finish.push(bookObject);

    document.dispatchEvent(new Event(rakBuku));
    saveData();

} 

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();      
      inputBuku.style.display = "none";
      resetBook()
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }

  });

function makeList(bookObject) {
  const {id, title, author, year, isCompleted} = bookObject; 

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;
 
  const textAuthor = document.createElement('p');
  textAuthor.innerText = "Penulis : " + author;

  const textYear = document.createElement('p');
  textYear.innerText = "Tahun : " + year;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('book_list');
  textContainer.append(textTitle, textAuthor, textYear);
 
  const container = document.createElement('div');
  container.classList.add('book_item');
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement('i');
    undoButton.className = "fa-solid fa-rotate-left";
    undoButton.title= "Baca kembali";
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
      
    });
 
    const trashIcon = document.createElement('i');
    trashIcon.className = "fas fa-trash-alt delete-list";
    trashIcon.title= "Hapus";
    trashIcon.addEventListener('click', function () {
      removeBookFromCompleted(id);
      
    });
 
    container.append(undoButton, trashIcon);

  } else {
    const checkButton = document.createElement('i');
    checkButton.className = "fa-solid fa-check";
    checkButton.title= "Selesai dibaca";
    checkButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });
    
    const trashIcon = document.createElement('i');
    trashIcon.className = "fas fa-trash-alt delete-list";
    trashIcon.title= "Hapus";
    trashIcon.addEventListener('click', function () {
      removeBookFromCompleted(id);
      
    });

    container.append(checkButton, trashIcon);
  }
  
  return container;
}


function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(rakBuku));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of finish) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const listTarget = findBookIndex(bookId);
 
  if (listTarget === -1) return;

  if (confirm("Apakah anda yakin ingin menghapus list buku ini?")) {
  finish.splice(listTarget, 1);
  document.dispatchEvent(new Event(rakBuku));
  saveData();
  }

}

function undoBookFromCompleted(bookId) {
  const listTarget = findBook(bookId);
 
  if (listTarget == null) return;
 
  listTarget.isCompleted = false;
  document.dispatchEvent(new Event(rakBuku));
  saveData();

}

function findBookIndex(bookId) {
  for (const index in finish) {
    if (finish[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

const saveBook = 'save-book';
const storageBook = 'book-apps';


function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(finish);
    localStorage.setItem(storageBook, parsed);
    document.dispatchEvent(new Event(saveBook));
  }
}

document.addEventListener(saveBook, () => {
  console.log('Berhasil di simpan.');
});


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(storageBook);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const list of data) {
      finish.push(list);
    }
  }
 
  document.dispatchEvent(new Event(rakBuku));
}


document.addEventListener(rakBuku, function () {

    const uncompletedbookList = document.getElementById('readingBook');
    uncompletedbookList.innerHTML = "";

    const completedbookList = document.getElementById('finishBook');
    completedbookList.innerHTML = "";
   
    for (const bookItem of finish) {
      const bookElement = makeList(bookItem)

      if (!bookItem.isCompleted) 
      uncompletedbookList.append(bookElement);
      else
      completedbookList.append(bookElement);
  }
    
  }); 

const cariList = document.querySelector("#searchBook");

cariList.addEventListener("keyup", pencarianList);

function pencarianList(e) {
  const cariList = e.target.value.toLowerCase();
  let itemList = document.querySelectorAll(".book_item");

  itemList.forEach((item) => {
      const isiItem = item.firstChild.textContent.toLowerCase();

      if (isiItem.indexOf(cariList) != -1) {
          item.setAttribute("style", "display: block;");
      } else {
          item.setAttribute("style", "display: none !important;");
      }

  });


}




































