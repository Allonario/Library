const MAX_BOOKS_COUNT = 10000

document.querySelectorAll('.create_input').forEach(function(input) {
    input.addEventListener("input", function () {
        checkInput()
    })
})

getBookTable().then(booksList => {
    document.querySelector('#id_panel').innerHTML = `ID: ${getNewId(booksList)}`
    console.log(/ID: (.+)/.exec(document.querySelector('#id_panel').textContent)[1])
})

document.querySelector('#availability_input').addEventListener('change', event => {
    checkInput()
    let readerInput = document.querySelector('#reader_input')
    let returnDateInput = document.querySelector('#return_date_input')
    if(event.target.checked){
        readerInput.disabled = true
        readerInput.placeholder = 'Книга находится в библиотеке'
        returnDateInput.disabled = true
    } else {
        readerInput.disabled = false
        readerInput.placeholder = ''
        returnDateInput.disabled = false
    }
})

document.querySelector('#cancel').addEventListener('click', () => {
    window.location.href = '/'
})

document.querySelector('#apply').addEventListener('click', () => {
    let new_book = {}
    new_book['id'] = parseInt(/ID: (.+)/.exec(document.querySelector('#id_panel').textContent)[1])
    new_book['bookName'] = document.querySelector('#book_title_input').value
    new_book['authorName'] = document.querySelector('#author_input').value
    new_book['creationDate'] = document.querySelector('#release_date_input').value
    new_book['available'] = document.querySelector('#availability_input').checked
    new_book['reader'] = null
    new_book['returnDate'] = null
    if (!new_book['available']) {
        new_book['returnDate'] = document.querySelector('#return_date_input').value
        new_book['reader'] = document.querySelector('#reader_input').value
    }
    request('api/books_list','POST', new_book).then(() => window.location.href = '/')
})


function checkInput(){
    let allInputsFilled = true
    let available = document.querySelector('#availability_input').checked
    console.log(available)
    let inputsNumber = 1

    document.querySelectorAll('.create_input').forEach(function(input) {
        if (input.value.trim() === "") {
            if((!available && (inputsNumber === 4 || inputsNumber === 5)) ||
                (available && !(inputsNumber === 4 || inputsNumber ===5))) {
                console.log('no')
                allInputsFilled = false
            }
        }
        console.log(inputsNumber)
        console.log(input)
        inputsNumber += 1
    });
    document.querySelector('#apply').disabled = !allInputsFilled
}


function getNewId(booksList){
    for(let id = 1; id <= MAX_BOOKS_COUNT; id++){
        if(!(id in booksList)) {
            return id
        }
    }
    return -1
}
