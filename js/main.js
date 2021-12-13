//DOM Selection
const buttonAdd = document.querySelector(".button-add");
const todoInput = document.querySelector(".todo-input");
const filterSelect = document.querySelector(".filter-todo");
const todoListElement = document.querySelector(".todo-list");
const pendingCountElement = document.querySelector(".pending-count");






function readFromLocalStorage() {
    let todoList = [];
    const todos = localStorage.getItem("todos");
    if ( todos && todos !== "undefined") {
        todoList = JSON.parse(todos);
    }
    todoList.map((todo) => renderTodo(todo));
    console.log("Loaded todos from local storage: ", todoList);
    const pendingCount = getPendingCount();
    pendingCountElement.innerText = `You have ${pendingCount} pending tasks.`;
}


function saveToLocalStorage(newTodo) {
    let todoList = [];
    const todos = localStorage.getItem("todos");
    if ( todos && todos !== "undefined") {
        todoList = JSON.parse(todos);
    }
    todoList.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todoList));
}


//CREATE
function addTodo(e) {
    // prevent form submission
    e.preventDefault();
    const todoText = todoInput.value;
    let newTodo = {
        text: todoText,
        done: false
    };
    saveToLocalStorage(newTodo);
    console.log("Data Added: ", newTodo);
    renderTodo(newTodo);
    const pendingCount = getPendingCount();
    pendingCountElement.innerText = `You have ${pendingCount} pending tasks.`;
    //clear input
    todoInput.value = "";
}


//DELETE
function deleteTodo(toDeleteTodo, currentTodoItem) {
    //read todoList from storage
    let todoList = [];
    const todos = localStorage.getItem("todos");
    if ( todos && todos !== "undefined") {
        todoList = JSON.parse(todos);
    }
    //filter todoList
    todoList = todoList.filter(
        (todo)=> todo.text !== toDeleteTodo.text
    );
    //save todoList to storage
    localStorage.setItem("todos", JSON.stringify(todoList));
    //animate
    currentTodoItem.classList.add("move");
    //event listener on trasition
    currentTodoItem.addEventListener("transitionend", (e) => {
        //manual waiting - workaround
        setTimeout(() => {
            //remove item from dom
            currentTodoItem.remove();
            const pendingCount = getPendingCount();
            pendingCountElement.innerText = `You have ${pendingCount} pending tasks.`;
        }, 400);
    });
}


//UPDATE
function toggleDoneTodo(toUpdateTodo, currentTodoItem) {
    let updatedTodo = {
        text: toUpdateTodo.text,
        done: !currentTodoItem.classList.contains("done") //toggle done
    };
    //read todoList from storage
    let todoList = [];
    const todos = localStorage.getItem("todos");
    if ( todos && todos !== "undefined") {
        todoList = JSON.parse(todos);
    }
    //update the todoList Item
    console.log(todoList);
    console.log(updatedTodo);
    todoList = todoList.map(
        (todo)=> todo.text === toUpdateTodo.text? updatedTodo : todo
    );
    console.log(todoList);
    //save todoList to storage
    localStorage.setItem("todos", JSON.stringify(todoList));    
    //DOM Update
    if (updatedTodo.done) {
        currentTodoItem.classList.add("done");
    } else {
        currentTodoItem.classList.remove("done");
    }
    const pendingCount = getPendingCount();
    pendingCountElement.innerText = `You have ${pendingCount} pending tasks.`;
}


//DOM Update
function renderTodo(todo) {
    //create and append todo-item li
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    /* add done Class*/
    if (todo.done) {
        todoItem.classList.add("done");
    }
    todoListElement.appendChild(todoItem);
    //create and append todo-text div
    const todoTextElement = document.createElement("div");
    todoTextElement.classList.add("todo-text", "pt-1");
    todoTextElement.innerText = todo.text;
    todoItem.appendChild(todoTextElement);
    //create and append check button
    const buttonDone = document.createElement("button");
    buttonDone.classList.add("btn", "btn-outline-success");
    buttonDone.innerHTML = `<i class="fas fa-check"></i>`;
    todoItem.append(buttonDone);
    //create and append trash button
    const buttonTrash = document.createElement("button");
    buttonTrash.classList.add("btn", "btn-outline-danger");
    buttonTrash.innerHTML = `<i class="fas fa-trash"></i>`;
    todoItem.append(buttonTrash);
    //Event Listeners for the created elements
    buttonDone.addEventListener("click", (e) => toggleDoneTodo(todo, todoItem));
    buttonTrash.addEventListener("click", (e) => deleteTodo(todo, todoItem));
}


//DOM Update
function filterTodos(e) {
    const filterValue = e.target.value;
    const todos = todoListElement.childNodes;

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => {
                todo.style.display = "flex";
            });
            break;
        case "done":
            todos.forEach((todo) => {
                if (todo.classList.contains("done")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
            });
            break;
        case "pending":
            todos.forEach((todo) => {
                if (!todo.classList.contains("done")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
            });
            break;
    }

}


//DOM Update
function getPendingCount() {
    const todosCount = todoListElement.childNodes.length;
    const doneTodosCount = todoListElement.querySelectorAll(".done").length;
    const pendingCount = todosCount - doneTodosCount;
    //console.log("pendingCount: ", pendingCount);
    return pendingCount;
}


//Event Listeners
window.addEventListener("load", readFromLocalStorage);
buttonAdd.addEventListener("click", addTodo);
filterSelect.addEventListener("click", filterTodos);
