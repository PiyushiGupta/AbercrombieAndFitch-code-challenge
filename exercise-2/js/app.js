$(document).ready(function(){
var taskInput = document.getElementById("new-task");
var addButton = document.getElementsByTagName("button")[0];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

addButton.addEventListener("click", addTask);

for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

for (var i = 0; i < completedTasksHolder.children.length; i++) {
  completedTasksHolder.children[i].firstChild.checked = true;
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}


var createNewTaskElement = function(taskString, arr) {
  listItem = document.createElement("li");
  checkBox = document.createElement("input");
  label = document.createElement("label");
  editInput = document.createElement("input");
  editButton = document.createElement("button");
  deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  label.innerText = taskString;

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
 };

var addTask = async function () {
  var listItemName = taskInput.value || "New Item";
  listItem = createNewTaskElement(listItemName);
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  taskInput.value = "";
         
  const todos = !localStorage.getItem("todos") ? [] : JSON.parse(localStorage.getItem("todos"));
  const currentTodo = {
    listItemName,
    isCompleted: false,
  };
  todos.push(currentTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
  taskInput.focus();
};

var editTask = function () {
  var listItem = this.parentNode;
  var editInput = listItem.querySelectorAll("input[type=text")[0];
  var label = listItem.querySelector("label");
  var button = listItem.getElementsByTagName("button")[0];

  var containsClass = listItem.classList.contains("editMode");
  if (containsClass) {
    if(todos) {
      todos.forEach(function (todo) {
        if(label.innerText === todo.listItemName){
          todo.listItemName = editInput.value;
          localStorage.setItem("todos", JSON.stringify(todos));
        }
      });
    }
    label.innerText = editInput.value
    button.innerText = "Edit";
  } else {
    editInput.value = label.innerText
    button.innerText = "Save";
  }
          
  listItem.classList.toggle("editMode");
};

var deleteTask = function (el) {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  ul.removeChild(listItem);

  var label = listItem.querySelector("label");
  if(todos) {
    todos.forEach(function (todo, index) {
      if(label.innerText === todo.listItemName){
        todos.splice(index, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  }
};

var taskCompleted = function (el) {
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);

  var label = listItem.querySelector("label");
  if(todos) {
    todos.forEach(function (todo, index) {
      if(label.innerText === todo.listItemName){
        todo.isCompleted = true;
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  }
};

var taskIncomplete = function() {
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  var label = listItem.querySelector("label");
  if(todos) {
    todos.forEach(function (todo, index) {
      if(label.innerText === todo.listItemName){
        todo.isCompleted = false;
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    });
  }
};

var bindTaskEvents = function(taskListItem, checkBoxEventHandler, cb) {
  var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
  var editButton = taskListItem.querySelectorAll("button.edit")[0];
  var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};


const todos = !localStorage.getItem("todos") ? [] : JSON.parse(localStorage.getItem("todos"));
if(todos) {
  todos.forEach(function (todo) {
    todolist = createNewTaskElement(todo.listItemName);
    if(todo.isCompleted) {
      completedTasksHolder.appendChild(todolist);
      bindTaskEvents(todolist, taskIncomplete);
    } else {
      incompleteTasksHolder.appendChild(todolist);
      bindTaskEvents(todolist, taskCompleted);
    }
  });
}

});