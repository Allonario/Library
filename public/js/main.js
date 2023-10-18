tableInit()

document.querySelector('#available_sort_button').addEventListener('change', event => {
    sortTable(event, 'availability')
})

document.querySelector('#overdue_sort_button').addEventListener('change', event => {
    sortTable(event, 'date')
})

document.querySelector('#new_book_button').addEventListener('click', () =>{
    window.location.href = '/book_creator'
})


function sortTable(event, sortType){
    const table = document.querySelector('#book_list')
    let rows = table.getElementsByTagName('tr')
    if(event.target.checked){
        while (rows.length >0){
            table.removeChild(rows[0])
        }
        fetch('/api/books_list')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                for(let key in data){
                    let item = JSON.parse(data[key])
                    if(sortType === 'date'){
                        document.querySelector('#available_sort_button').checked = false
                        if(item['returnDate']){
                            let dateArray = item['returnDate'].split("-")
                            if(new Date(parseInt(dateArray[0], 10),
                                parseInt(dateArray[1], 10) - 1,
                                parseInt(dateArray[2], 10)) < new Date()) {
                                addRow(item)
                                console.log(item)
                            }
                        }
                    } else if(sortType === 'availability'){
                        document.querySelector('#overdue_sort_button').checked = false
                        if(item['available']){
                            addRow(item)
                        }
                    }

                }
                buttonListener()
            });
    } else {
        tableInit()
    }
}


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


function tableInit(){getBookTable().then(uploadTable).then(buttonListener)}


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
    delete_button.innerHTML = 'Удалить книгу'
    document.querySelector(buttonId).appendChild(delete_button)
    let book_page_button = document.createElement("button")
    book_page_button.id = `${"book_page_button_" + dataList.id}`
    book_page_button.className = 'book_page_button'
    book_page_button.innerHTML = 'Перейти к книге'
    buttonId = "#book_page_" + dataList.id
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
