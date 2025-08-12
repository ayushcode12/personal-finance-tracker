const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const categorySelected = document.getElementById('category');
const cancelButton = document.getElementById('cancelBtn');
const dateInput = document.getElementById('date');

dateInput.value = new Date().toISOString().split('T')[0];

cancelButton.addEventListener('click', handleCancelEdit)

let transactionList = JSON.parse(localStorage.getItem("transactions")) || [];

updateTotal();
renderList(transactionList);

form.addEventListener('submit', function(event){
  event.preventDefault();

  document.getElementById('submit').textContent = "Add Transaction";
  document.getElementById('cancelBtn').style.display = "none";

  if(textInput.value.trim() === "" || isNaN(Number(amountInput.value)) || Number(amountInput.value)===0){
    return alert("Please enter a valid description and amount.")
  }
  
  if(editId !== ""){
    transactionList.forEach((t) => {
      if(t.id === editId){
        t.text = textInput.value;
        t.amount = Number(amountInput.value);
        t.category = categorySelected.value;
      }
    });
  }

  else{
    const transactions = {
      id: Date.now(),
      text: textInput.value,
      amount: Number(amountInput.value),
      category: categorySelected.value,
      date: dateInput.value || new Date().toISOString().split('T')[0],
    }
    transactionList.push(transactions);
  }

  localStorage.setItem("transactions", JSON.stringify(transactionList));
  editId = "";
  renderList(transactionList);
  updateTotal();

  textInput.value = "";
  amountInput.value= "";
  categorySelected.value = "";
})

const filterDropdown = document.getElementById('filterCategory')
filterDropdown.addEventListener('change', (event) => {
  let selectedOption = event.target.value;

  let filteredList = selectedOption.toLowerCase() === "all" 
                    ? transactionList
                    : transactionList.filter((t) => t.category === selectedOption);

  renderList(filteredList);

})

function updateTotal(){
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  transactionList.forEach((obj) => {
    totalBalance += obj.amount;

    if(obj.amount > 0){
      totalIncome += obj.amount;
    }

    else if(obj.amount < 0){
      totalExpense += obj.amount;
    }
  })

  const div1 = document.getElementById('income-amount');
  div1.textContent = `₹${(totalIncome).toFixed(2)}`;

  const div2 = document.getElementById('expense-amount');
  div2.textContent = `₹${Math.abs(totalExpense).toFixed(2)}`;

  const span = document.getElementById('balance');
  span.textContent = ` ₹${(totalBalance).toFixed(2)}`;
}

function deleteListItem(event){

  let userConfirmation = confirm("Are you sure you want to delete this transaction?")

  if(userConfirmation){
    const id = Number(event.target.dataset.id);
    transactionList = transactionList.filter((t) => t.id !== id);

    localStorage.setItem("transactions", JSON.stringify(transactionList))

    renderList(transactionList)
    alert("Deletd Successfully!")
  }
  else{
    alert("Cancelled")
  }
  updateTotal();
}

function renderList(transactionArray){
  const table = document.getElementById('list');
  table.innerHTML = "";

  if(transactionArray.length === 0){
    const tr = document.createElement('tr');
    tr.textContent = "No transactions to display.";
    tr.classList.add("empty-message");
    table.appendChild(tr);
  }

  else{
    transactionArray.forEach((transaction) => {
      const tr = document.createElement('tr');

      const formattedAmount = transaction.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
      const formattedDate = new Date(transaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });


      let tdDate = document.createElement('td');
      tdDate.textContent = formattedDate;
      tr.appendChild(tdDate);

      let tdDescription = document.createElement('td');
      tdDescription.textContent = transaction.text;
      tr.appendChild(tdDescription);

      let tdCategory = document.createElement('td');
      tdCategory.textContent = transaction.category;
      tr.appendChild(tdCategory);

      let tdAmount = document.createElement('td');
      tdAmount.textContent = formattedAmount;
      tr.appendChild(tdAmount);

      if(transaction.amount > 0){
        tdAmount.classList.add("incomes");
      }
      else if(transaction.amount < 0){
        tdAmount.classList.add("expenses");
      }

      const deleteButton = document.createElement('button');
      deleteButton.textContent = "❌";
      deleteButton.classList.add("delete-btn");

      deleteButton.dataset.id = transaction.id;

      deleteButton.addEventListener('click', deleteListItem);

      const editButton = document.createElement('button');
      editButton.textContent = "✏️";
      editButton.classList.add("edit-btn");

      editButton.dataset.id = transaction.id;

      editButton.addEventListener('click', editListItem);

      const actionsTd = document.createElement('td');

      actionsTd.classList.add('action-col')
      actionsTd.appendChild(editButton);
      actionsTd.appendChild(deleteButton);
      tr.appendChild(actionsTd);
      table.appendChild(tr);
    });
  } 
}

let editId = "";

function editListItem(event){

  document.getElementById('submit').textContent = "Update";
  document.getElementById('cancelBtn').style.display = "inline";

  const id = Number(event.target.dataset.id);
  let clickedItem = transactionList.find(t => t.id === id);
  textInput.value = clickedItem.text;
  amountInput.value = clickedItem.amount;
  categorySelected.value = clickedItem.category;
  dateInput.value = clickedItem.date;
  editId = id;
}

function handleCancelEdit(){
  textInput.value = "";
  amountInput.value = "";
  categorySelected.value = "";

  editId = "";

  document.getElementById('submit').textContent = "Add Transaction";
  document.getElementById('cancelBtn').style.display = "none";

  textInput.focus();
  renderList(transactionList); 

}