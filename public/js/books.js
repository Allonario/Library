if(document.querySelector('#reader_information_button')) {
    document.querySelector('#reader_information_button').addEventListener('click', () => {
        document.querySelector('#reader_information').showModal()
    })
}

if(document.querySelector('#close_reader_information_button')) {
    document.querySelector('#close_reader_information_button').addEventListener('click', () => {
        document.querySelector('#reader_information').close()
    })
}

if(document.querySelector('#issue_book_button')) {
    document.querySelector('#issue_book_button').addEventListener('click', () => {
        document.querySelector('#issue_book_dialog').showModal()
    })
}

if(document.querySelector('#close_book_issuance_button')) {
    document.querySelector('#close_book_issuance_button').addEventListener('click', () => {
        document.querySelector('#issue_book_dialog').close()
    })
}

if(document.querySelector('#confirm_book_issuance_button')) {
    document.querySelector('#confirm_book_issuance_button').addEventListener('click', () => {
        let changes = {
            'reader': document.querySelector('#reader_name').value,
            'returnDate': document.querySelector('#return_date').value,
            'available': false
        }
        let id = /\/book\/(\d+)/.exec(window.location.href)[1]
        request(`/api/books_list/${id}`, 'PUT', changes).then(() => {
            document.querySelector('#issue_book_dialog').close()
            window.location.reload()
        })
    })
}

if(document.querySelector('#return_book_button')) {
    document.querySelector('#return_book_button').addEventListener('click', () => {
        let changes = {
            'reader': null,
            'returnDate': null,
            'available': true
        }
        let id = /\/book\/(\d+)/.exec(window.location.href)[1]
        request(`/api/books_list/${id}`, 'PUT', changes).then(() => {
            window.location.reload()
        })
    })
}

document.querySelectorAll('.change_button').forEach(button => {
    button.addEventListener('click', () => {
        let id = '#' + /(.+)button/.exec(button.id)[1] + 'dialog'
        document.querySelector(`${id}`).showModal()
    })
})

document.querySelectorAll('.cancel_button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll(`.dialog`).forEach(dialog => {
            dialog.close()
        })
    })
})

document.querySelectorAll('.confirm_button').forEach(button => {
    button.addEventListener('click', () => {
        let name = /(.+)_button/.exec(button.id)[1]
        let value = document.querySelector(`#${name}`).value
        let changes = {}
        changes[name] = value
        let id = /\/book\/(\d+)/.exec(window.location.href)[1]
        request(`/api/books_list/${id}`, 'PUT', changes).then(() => {
            window.location.reload()
        })
    })
})

document.querySelector('#main_page').addEventListener('click', () => {
    window.location.href = '/'
})


