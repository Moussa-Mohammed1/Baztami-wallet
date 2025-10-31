let transactions = JSON.parse(localStorage.getItem('transactions')) ||  [];
let Edit_id = null;

const addTransaction_Btn = document.getElementById("addTransaction");
const transactionCard = document.getElementById("transactionCard");
const cancel_Btn = document.getElementById("cancelTransaction"); 
const save_Btn = document.getElementById("save");

const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");
const transactionHistory = document.getElementById("transactionHistory");
const balanceRef = document.getElementById("balance");
const expensesRef = document.getElementById("expenses"); // set reference for each statistic number
const incomeRef = document.getElementById("expenses");


dateInput.valueAsDate = new Date(); // set date by default to the current date

addTransaction_Btn.addEventListener('click', () => {
  transactionCard.classList.remove('hidden');
  transactionCard.classList.add('flex');
  Edit_id = null;
  clearForm();
});

cancel_Btn.addEventListener('click', () => {
  transactionCard.classList.remove('flex');
  transactionCard.classList.add('hidden');
  Edit_id = null;
  clearForm();
});

save_Btn.addEventListener('click', ()=> {
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector('input[name="type"]:checked')?.value;
  const date = dateInput.value;
  const description = descriptionInput.value;

  if(!amount || amount <= 0){
    alert("Enter a valid amount");
    return;
  }
  if(!type){
    alert("Select a transaction type");
    return;
  }

  const transaction ={
    id : Edit_id || date.now(),
    amount : amount, 
    type : type,
    date : date,
    description : description || 'This card have no description'

  };
})
