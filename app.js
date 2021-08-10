const todoInput = document.querySelector('input')
const list = document.querySelector('ul')
const todoInfo = document.querySelector('.todoInfo')
const underLines = document.querySelector('.underLines')
const itemNumber = document.querySelector('.itemNumber')
const inputArrow = document.querySelector('.arrow')
const clearBtn = document.querySelector('.clearCompletedBtn')
const allBtn = document.querySelector('.allBtn')
const activeBtn = document.querySelector('.activeBtn')
const compleatedBtn = document.querySelector('.compleatedBtn')

allBtn.classList.add('buttonActive')

let todoList = [{
    value: 'hello',
    id: Date.now(),
    done: false
}]

const activeFilter = [
    {
        filterName: 'all',
        active: true
    },
    {
        filterName: 'active',
        active: false
    },
    {
        filterName: 'completed',
        active: false
    },
]

const infoButtons = [
        {
            buttonName: allBtn,
            content: 'all',
            active: true
        },
        {
            buttonName: activeBtn,
            content: 'active',
            active: false
        }, 
        {
            buttonName: compleatedBtn,
            content: 'completed',
            active: false
        }
]

const deleteTodoItem = (todoId) => {
    setTodoList(todoList.filter(elem => elem.id !== +todoId))
}

const addTodoItem = (itemValue) =>{
    setTodoList([...todoList, {
        value: itemValue,
        id: Date.now(),
        done: false
    }])
}

const changeItemStatus = (id, isChecked) => {
    setTodoList(todoList.map( item => id === item.id ? {...item, done: isChecked} : item))
}


const setActiveFilter = ({target:{textContent}}) => {
    const clickedBtn = textContent.toLowerCase()

    infoButtons.forEach( btn => {
        btn.active = false
        btn.buttonName.classList.remove('buttonActive')
        if(clickedBtn === btn.content){
            btn.active = true
            btn.buttonName.classList.add('buttonActive')
            activeFilter.forEach(filter => { 
                filter.active = false
                if(filter.filterName === btn.content){
                    filter.active = true
                }
            })
        }
    })
    setTodoList(todoList)
}

allBtn.addEventListener('click', (e)=>setActiveFilter(e))

activeBtn.addEventListener('click', (e)=>setActiveFilter(e))

compleatedBtn.addEventListener('click', (e)=>setActiveFilter(e))

const itemRender = () => {
    list.innerText = ''

    const todoListToRender = todoList.filter(todoItem => {
        const currentFilter = activeFilter.find(filter => filter.active)

        if(currentFilter.filterName === 'active'){
            return !todoItem.done ? todoItem : null 
        }
        if(currentFilter.filterName === 'completed'){
            return todoItem.done ? todoItem : null
        }
        if(currentFilter.filterName === 'all'){
            return todoItem
        }
    })

    todoListToRender.forEach( item => {
        const li = document.createElement('li')
        const delBtn = document.createElement('div')
        const label = document.createElement('label')
        const checkInput = document.createElement('input')
        const checkmark = document.createElement('span')
        const itemText = document.createElement('p')
        const itemInputWrapper = document.createElement('div')
        const itemInput = document.createElement('input')

        itemInputWrapper.classList.add('itemInputWrapper')
        itemInput.classList.add('itemInput')
        itemText.classList.add('itemText')
        checkInput.setAttribute('type', 'checkBox')
        label.classList.add('container')
        checkmark.classList.add('checkmark')
        
        li.dataset.todoId = item.id       
    
        const editCurrentTodoItem = editTodoItem(itemInput, label, delBtn)

        li.addEventListener('click',() => {
            editCurrentTodoItem()
        })

        checkInput.addEventListener('change',(e) => {
            const id = +e.target.parentElement.parentElement.dataset.todoId
            const isChecked = e.target.checked
            changeItemStatus(id, isChecked)
        })
        
        if(item.done) {
            checkInput.setAttribute('checked', 'checked')
        }
        itemText.classList.add([item.done ? 'notActive' : 'active'])
     
        delBtn.classList.add('delBtn')
        delBtn.addEventListener('click', ({target:{parentElement:{dataset:{todoId}}}}) => deleteTodoItem(todoId) )
        itemInputWrapper.append(itemInput)
        itemText.textContent = item.value
        itemInput.value = item.value
        label.append(checkInput, checkmark)
        li.append(label,itemText,itemInputWrapper,delBtn)
        list.append(li) 
    })    
    todoInput.value = ''
}

const editTodoItem = (input, label, delBtn) => {	

    const changeItemValue = () => {
        const itemValue = input.value.trim()
        const parentId = +input.parentElement.parentElement.dataset.todoId
        setTodoList(todoList.map(item => parentId === item.id ? {...item, value: itemValue} : item))
    }

    let lastClick = 0
	return () => {	
		input.addEventListener('click', (e)=>{
			e.stopPropagation()
		}) 

        input.addEventListener('blur', changeItemValue)

		input.addEventListener('keydown', keyPressed => {
			if (keyPressed.key === 'Enter') {
				changeItemValue()
			}
		})      
        
        const d = Date.now();       
        const isDblClick = d - lastClick < 400 ? true : false
           
        label.classList[isDblClick ? 'add': 'remove']('containerHide')
        delBtn.classList[isDblClick ? 'add': 'remove']('delBtnHide')
        input.classList[isDblClick ? 'add': 'remove']('itemInputVisible')

        input.focus()
        lastClick = d;   
    } 
}

todoInput.addEventListener('keydown', keyPressed => {
    const itemValue = todoInput.value.trim()
      
    if(!itemValue){
        todoInput.value = ''
        return
    }

    if (keyPressed.key === 'Enter') {
        addTodoItem(itemValue) 
    }
})

const clearCompleted = () => { 
    setTodoList(todoList.filter(item => item.done === false))
}

const updateClearCompletedBtn = () => {
    const isTodoItemChecked = todoList.some(item => item.done === true)

    clearBtn.classList.add("clearCompleatedBtn");
    clearBtn.classList[isTodoItemChecked ? "add" : "remove"]("clearCompletedBtnVisible");
}

clearBtn.addEventListener('click', clearCompleted)

const checkAllItems = arr => {
    const isCheckedAllItems = arr.every(item => item.done === true)
    return isCheckedAllItems
}

inputArrow.addEventListener('click', ()=>{    
    changeAllItemsStatus(checkAllItems(todoList))
})

const changeAllItemsStatus = (isCheckedAllItems) => {
    setTodoList(todoList.map(item => isCheckedAllItems ? {...item, done: false} : {...item, done: true}))
}

const changeInputArrowColor = () => {
   inputArrow.classList[checkAllItems(todoList) ? 'add': 'remove']('arrowDark')
}

const updateTodoInfo = () => {   
    const notCheckeditems = todoList.filter(item => item.done === false)

    todoInfo.classList.add('todoInfoHide')
    underLines.classList.add('underLinesHide')

    if(todoList.length){
        itemNumber.textContent = `${notCheckeditems.length} item left`      
        todoInfo.classList.remove('todoInfoHide')
        underLines.classList.remove('underLinesHide') 
        if(notCheckeditems.length > 1 || notCheckeditems.length === 0){
            itemNumber.textContent = `${notCheckeditems.length} items left` 
        }
    }  
}

const updateInputArrow = () => {
    inputArrow.classList[todoList.length ? 'add':'remove']('arrowVisible')
}

const setTodoList = newTodoList => {
    todoList = newTodoList

    
    updateClearCompletedBtn()
    updateTodoInfo()
    updateInputArrow()
    changeInputArrowColor()
    
    itemRender()
}


setTodoList(todoList)



// Можешь сделать состояние еще одно по типу, как у тебя сейчас todoList - activeFilter

// Где будет completed, active или что у тебя там

// И потом в рендере выводить не весть todoList, а фильтровать в зависимости от того, чему равен activeFilter

// Ну в самой функции, где ты рендеришь тудушки. Чтобы потом по отфильтрованному массиву пройтись

// Но тебе не обязательно под каждый случай считать:

// const todoListToRender = todoList.filter((item) => .....) и внутри уже в зависимости какой фильтр выбран фильтруешь

// Сделай по аналогии activeFilter и  setActiveFilter

// Потом в рендере тудулиста тебе надо будет учитывать этот activeFilter - в зависимости от него будешь соответствующе фильтровать список

// И выводить уже с учетом фильтра тудушки


