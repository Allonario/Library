tableInit()

document.querySelector('#available_sort_button').addEventListener('change', event => {
    if(event.target.checked) {
        document.querySelector('#overdue_sort_button').checked = false
        tableInit('?filter=available')
    } else if(!document.querySelector('#overdue_sort_button').checked){
        tableInit()
    }
})

document.querySelector('#overdue_sort_button').addEventListener('change', event => {
    if(event.target.checked) {
        document.querySelector('#available_sort_button').checked = false
        tableInit('?filter=overdue')
    } else if(!document.querySelector('#available_sort_button').checked){
        tableInit()
    }
})

document.querySelector('#new_book_button').addEventListener('click', () =>{
    window.location.href = '/book_creator'
})


function buttonListener() {
    document.querySelectorAll('.delete_button').forEach(button => {
        button.addEventListener('click', () => {
            const id = /delete_button_(\d+)/.exec(button.id)[1]
            request(`/api/books_list/${id}`, 'DELETE').then(
                document.querySelector(`#book_list`).removeChild(document.querySelector(`#book_${id}`)))
        })
    })
    document.querySelectorAll('.book_page_button').forEach(button => {
        button.addEventListener('click', () => {
            const id = /book_page_button_(\d+)/.exec(button.id)[1]
            window.location.href = `/book/${id}`
        })
    })
}


function tableInit(filteringParameter){
    getBookTable(filteringParameter).then(uploadTable).then(buttonListener)
}


function addRow(dataList){
    let row = document.createElement('tr')
    row.id = 'book_' + dataList.id
    row.innerHTML = `
            <td class = 'book_name' id = '${"book_name_" + dataList.id}'>${dataList.bookName}</td>
            <td class = 'author_name' id = '${"author_name_" + dataList.id}'>${dataList.authorName}</td>
            <td class = 'delete' id = '${"delete_" + dataList.id}'></td>
            <td class = 'book_page' id = '${"book_page_" + dataList.id}'></td>
            `
    document.querySelector('#book_list').appendChild(row)
    let delete_button = document.createElement("button")
    delete_button.id = `${"delete_button_" + dataList.id}`
    delete_button.className = 'delete_button'
    let buttonId = "#delete_" + dataList.id
    let icon = document.createElement("i")
    icon.className = 'fa-solid fa-trash'
    delete_button.appendChild(icon)
    document.querySelector(buttonId).appendChild(delete_button)
    let book_page_button = document.createElement("button")
    book_page_button.id = `${"book_page_button_" + dataList.id}`
    book_page_button.className = 'book_page_button'
    buttonId = "#book_page_" + dataList.id
    icon = document.createElement("i")
    icon.className = 'fa-solid fa-book-open'
    book_page_button.appendChild(icon)
    document.querySelector(buttonId).appendChild(book_page_button)
}


function uploadTable(booksList){
    document.querySelector('#book_list_container').innerHTML = `<table id = 'book_list'></table>`
    for (let key in booksList) {
        const dataList = JSON.parse(booksList[key])
        console.log(dataList)
        addRow(dataList)
    }
}
