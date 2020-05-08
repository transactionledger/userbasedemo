
userbase.init({ appId: '54f1020c-a366-416f-b9ca-3f140b975383' })

function handleLogin(e) {
    e.preventDefault()

    const username = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value

    userbase.signIn({ username, password, rememberMe: 'none' })
        .then((user) => showTodos(user.username))
        .catch((e) => document.getElementById('login-error').innerHTML = e)
}

function handleSignUp(e) {
    e.preventDefault()

    const username = document.getElementById('signup-username').value
    const password = document.getElementById('signup-password').value

    userbase.signUp({ username, password, rememberMe: 'none' })
        .then((user) => showTodos(user.username))
        .catch((e) => document.getElementById('signup-error').innerHTML = e)
}

function showTodos(username) {
    document.getElementById('auth-view').style.display = 'none'
    document.getElementById('todo-view').style.display = 'block'

    // reset the todos view
    document.getElementById('username').innerHTML = username
    document.getElementById('todos').innerText = ''
    document.getElementById('db-loading').style.display = 'block'
    document.getElementById('db-error').innerText = ''

    userbase.openDatabase({ databaseName: 'todos', changeHandler })
        .catch((e) => document.getElementById('db-error').innerText = e)
}

function changeHandler(items) {
    document.getElementById('db-loading').style.display = 'none'

    const todosList = document.getElementById('todos')

    if (items.length === 0) {
        todosList.innerText = 'Empty'
    } else {
        // clear the list
        todosList.innerHTML = ''

        // render all the to-do items
        for (let i = 0; i < items.length; i++) {

            // build the todo label
            const todoLabel = document.createElement('label')
            todoLabel.innerHTML = items[i].item.todo
            todoLabel.style.textDecoration = items[i].item.complete ? 'line-through' : 'none'

            // append the todo item to the list
            const todoItem = document.createElement('div')
            todoItem.appendChild(todoLabel)
            todosList.appendChild(todoItem)
        }
    }
}

function addTodoHandler(e) {
    e.preventDefault()

    const todo = document.getElementById('add-todo').value

    userbase.insertItem({ databaseName: 'todos', item: { 'todo': todo }})
      .then(() => document.getElementById('add-todo').value = '')
      .catch((e) => document.getElementById('add-todo-error').innerHTML = e)
  }

document.getElementById('login-form').addEventListener('submit', handleLogin)
document.getElementById('signup-form').addEventListener('submit', handleSignUp)
document.getElementById('add-todo-form').addEventListener('submit', addTodoHandler)

document.getElementById('todo-view').style.display = 'none'