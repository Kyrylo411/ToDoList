const todoInput = document.querySelector("input");
const list = document.querySelector("ul");
const todoInfo = document.querySelector(".todoInfo");
const underLines = document.querySelector(".underLines");
const itemNumber = document.querySelector(".itemNumber");
const inputArrow = document.querySelector(".arrow");
const clearBtn = document.querySelector(".clearCompletedBtn");
const allBtn = document.querySelector(".allBtn");
const activeBtn = document.querySelector(".activeBtn");
const compleatedBtn = document.querySelector(".compleatedBtn");

allBtn.classList.add("buttonActive");
let activeFilter = "all";

let todoList = [
  {
    value: "hello",
    id: Date.now(),
    done: false,
  },
];

const infoButtons = [
  {
    buttonName: allBtn,
    id: "all",
  },
  {
    buttonName: activeBtn,
    id: "active",
  },
  {
    buttonName: compleatedBtn,
    id: "completed",
  },
];

const deleteTodoItem = (todoId) => {
  setTodoList(todoList.filter((elem) => elem.id !== +todoId));
};

const addTodoItem = (itemValue) => {
  setTodoList([
    ...todoList,
    {
      value: itemValue,
      id: Date.now(),
      done: false,
    },
  ]);
};

const changeItemStatus = (id, isChecked) => {
  setTodoList(
    todoList.map((item) =>
      id === item.id ? { ...item, done: isChecked } : item
    )
  );
};

const setActiveFilter = (newFilter) => {
  activeFilter = newFilter;

  selectActiveInfoButton();
  itemRender();
};

const selectActiveInfoButton = () => {
  infoButtons.forEach((btn) =>
    btn.buttonName.classList[btn.id === activeFilter ? "add" : "remove"](
      "buttonActive"
    )
  );
};

const changeActiveFilter = ({ target: { textContent } }) => {
  setActiveFilter(textContent.toLowerCase());
};

allBtn.addEventListener("click", (e) => {
  changeActiveFilter(e);
});

activeBtn.addEventListener("click", (e) => {
  changeActiveFilter(e);
});

compleatedBtn.addEventListener("click", (e) => {
  changeActiveFilter(e);
});

const itemRender = () => {
  list.innerText = "";

  const todoListToRender = todoList.filter((todoItem) => {
    const filterMap = {
      active: !todoItem.done ? todoItem : null,
      completed: todoItem.done ? todoItem : null,
      all: todoItem,
    };
    return filterMap[activeFilter];
  });

  todoListToRender.forEach((item) => {
    const li = document.createElement("li");
    const delBtn = document.createElement("div");
    const label = document.createElement("label");
    const checkInput = document.createElement("input");
    const checkmark = document.createElement("span");
    const itemText = document.createElement("p");
    const itemInputWrapper = document.createElement("div");
    const itemInput = document.createElement("input");

    itemInputWrapper.classList.add("itemInputWrapper");
    itemInput.classList.add("itemInput");
    itemText.classList.add("itemText");
    checkInput.setAttribute("type", "checkBox");
    label.classList.add("container");
    checkmark.classList.add("checkmark");

    li.dataset.todoId = item.id;

    const editCurrentTodoItem = makeTodoEditHandler(itemInput, label, delBtn);

    li.addEventListener("click", editCurrentTodoItem);

    checkInput.addEventListener("change", (e) => {
      const id = +e.target.parentElement.parentElement.dataset.todoId;
      const isChecked = e.target.checked;
      changeItemStatus(id, isChecked);
    });

    if (item.done) {
      checkInput.setAttribute("checked", "checked");
    }
    itemText.classList.add([item.done ? "notActive" : "active"]);

    delBtn.classList.add("delBtn");
    delBtn.addEventListener(
      "click",
      ({
        target: {
          parentElement: {
            dataset: { todoId },
          },
        },
      }) => deleteTodoItem(todoId)
    );
    itemInputWrapper.append(itemInput);
    itemText.textContent = item.value;
    itemInput.value = item.value;
    label.append(checkInput, checkmark);
    li.append(label, itemText, itemInputWrapper, delBtn);
    list.append(li);
  });
  todoInput.value = "";
};

const makeTodoEditHandler = (input, label, delBtn) => {
  const changeItemValue = () => {
    const itemValue = input.value.trim();
    const parentId = +input.parentElement.parentElement.dataset.todoId;
    setTodoList(
      todoList.map((item) =>
        parentId === item.id ? { ...item, value: itemValue } : item
      )
    );
  };

  let lastClick = 0;
  return () => {
    input.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    input.addEventListener("blur", changeItemValue);

    input.addEventListener("keydown", (keyPressed) => {
      if (keyPressed.key === "Enter") {
        changeItemValue();
      }
    });

    const d = Date.now();
    const isDblClick = d - lastClick < 400 ? true : false;

    label.classList[isDblClick ? "add" : "remove"]("containerHide");
    delBtn.classList[isDblClick ? "add" : "remove"]("delBtnHide");
    input.classList[isDblClick ? "add" : "remove"]("itemInputVisible");

    input.focus();
    lastClick = d;
  };
};

todoInput.addEventListener("keydown", (keyPressed) => {
  const itemValue = todoInput.value.trim();

  if (!itemValue) {
    todoInput.value = "";
    return;
  }

  if (keyPressed.key === "Enter") {
    addTodoItem(itemValue);
  }
});

const clearCompleted = () => {
  setTodoList(todoList.filter((item) => item.done === false));
};

const updateClearCompletedBtn = () => {
  const isTodoItemChecked = todoList.some((item) => item.done === true);

  clearBtn.classList.add("clearCompleatedBtn");
  clearBtn.classList[isTodoItemChecked ? "add" : "remove"](
    "clearCompletedBtnVisible"
  );
};

clearBtn.addEventListener("click", clearCompleted);

const checkAllItems = (arr) => {
  const isCheckedAllItems = arr.every((item) => item.done === true);
  return isCheckedAllItems;
};

inputArrow.addEventListener("click", () => {
  changeAllItemsStatus(checkAllItems(todoList));
});

const changeAllItemsStatus = (isCheckedAllItems) => {
  setTodoList(
    todoList.map((item) =>
      isCheckedAllItems ? { ...item, done: false } : { ...item, done: true }
    )
  );
};

const changeInputArrowColor = () => {
  inputArrow.classList[checkAllItems(todoList) ? "add" : "remove"]("arrowDark");
};

const updateTodoInfo = () => {
  const notCheckeditems = todoList.filter((item) => item.done === false);

  todoInfo.classList.add("todoInfoHide");
  underLines.classList.add("underLinesHide");

  if (todoList.length) {
    itemNumber.textContent = `${notCheckeditems.length} item left`;
    todoInfo.classList.remove("todoInfoHide");
    underLines.classList.remove("underLinesHide");
    if (notCheckeditems.length > 1 || notCheckeditems.length === 0) {
      itemNumber.textContent = `${notCheckeditems.length} items left`;
    }
  }
};

const updateInputArrow = () => {
  inputArrow.classList[todoList.length ? "add" : "remove"]("arrowVisible");
};

const setTodoList = (newTodoList) => {
  todoList = newTodoList;

  updateClearCompletedBtn();
  updateTodoInfo();
  updateInputArrow();
  changeInputArrowColor();
  itemRender();
};

setActiveFilter(activeFilter);
setTodoList(todoList);
