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
const expensesRef = document.getElementById("expenses");
const incomeRef = document.getElementById("income");

dateInput.valueAsDate = new Date();

addTransaction_Btn.addEventListener('click', () => {
  transactionCard.classList.remove('hidden');
  const title = document.getElementById("forumTitle");
  title.textContent = "Add new transaction";
  title.classList.add("bg-stone-800");
  title.classList.remove("bg-green-800");
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
    id: Edit_id || Date.now(),
    amount : amount, 
    type : type,
    date : date,
    description : description || 'This card have no description'
  };

  if (Edit_id) {
    const index = transactions.findIndex(trnsction => trnsction.id === Edit_id );
    transactions[index] = transaction;
  }
  else {
    transactions.push(transaction);
  }
  
  saveToLocalStorage();
  updateStatistic();

  transactionCard.classList.add('hidden');
  transactionCard.classList.remove('flex');
  clearForm();
  Edit_id = null;
});

function createtransactionCard(transaction){
  const isIncome = transaction.type === "Income";
  const card = document.createElement('div');
  card.className = `transaction-card bg-gradient-to-br 
                    ${isIncome ? 'from-green-400 to-green-600' : 'from-red-500 to-red-700'} 
                    rounded-xl p-5 shadow-lg hover:shadow-2xl transform hover:bg-green-500 
                    transition-all duration-300`;
  
  card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-2">
                <i class="fa-solid ${isIncome ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}
                 text-white text-xl"></i> <span class="text-white font-bold text-lg">
                 ${transaction.type}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="editTransaction(${transaction.id})" 
                    class="bg-white/20 hover:bg-white/40 text-white 
                    px-3 py-1 rounded-lg transition duration-200">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="confirmDelete(${transaction.id})" 
                    class="bg-white/20 hover:bg-red-900 text-white 
                    px-3 py-1 rounded-lg transition duration-200">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
        
        <div class="text-white mb-3">
            <p class="text-3xl font-bold">${transaction.amount.toFixed(2)} MAD</p>
        </div>
        
        <div class="text-white/90 text-sm mb-2">
            <i class="fa-solid fa-calendar mr-2"></i>${transaction.date}
        </div>
        
        <div class="text-white/80 text-sm border-t border-white/20 pt-2 mt-2">
            <p class="line-clamp-2">${transaction.description}</p>
        </div>
    `;
  return card;
}

function editTransaction(id){
  const transaction = transactions.find(trnsction => trnsction.id === id);
  if(!transaction) return;

  Edit_id = id;
  amountInput.value = transaction.amount;
  dateInput.value = transaction.date;
  descriptionInput.value = transaction.description;

  document.querySelector(`input[value="${transaction.type}"]`).checked = true;

  transactionCard.classList.remove('hidden');
  const title = document.getElementById("forumTitle");
  title.textContent = "Edit existing transaction";
  title.classList.remove( 'bg-stone-800');
  title.classList.add("bg-green-800");
  transactionCard.classList.add('flex');
}

function confirmDelete(id){
  const transaction = transactions.find(trnsction => trnsction.id === id);

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 flex justify-center items-center bg-black/70 z-50 delete-confirm';
   modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl">
            <div class="text-center mb-6">
                <i class="fa-solid fa-trash text-red-600 text-6xl mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
                <p class="text-gray-600">Are you sure you want to delete this transaction?</p>
                <div class="mt-4 bg-gray-100 p-4 rounded-lg">
                    <p class="font-semibold text-lg">
                    ${transaction.amount} MAD</p>
                    <p class="text-sm text-gray-500">
                    ${transaction.type} - ${transaction.date}</p>
                </div>
            </div>
            <div class="flex gap-4">
                <button onclick="this.closest('.delete-confirm').remove()" 
                    class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 
                    font-semibold py-3 rounded-lg transition duration-200">
                    Cancel
                </button>
                <button onclick="deleteTransaction(${id}); this.closest('.delete-confirm').remove()" 
                    class="flex-1 bg-red-500 hover:bg-red-600 text-white 
                    font-semibold py-3 rounded-lg transition duration-200">
                    Delete
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function deleteTransaction(id){
  transactions = transactions.filter(trnsction => trnsction.id !== id);
  saveToLocalStorage();
  updateStatistic();
}

function updateStatistic(){
  const income = transactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'Expenses')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;

  balanceRef.textContent = balance.toFixed(2);
  expensesRef.textContent = expenses.toFixed(2);
  incomeRef.textContent = income.toFixed(2);

  transactionHistory.innerHTML = '';

  if (transactions.length === 0) {
    transactionHistory.innerHTML = `
            <div class="col-span-full text-center text-white/60 py-12">
                <i class="fa-solid fa-inbox text-6xl mb-4"></i>
                <p class="text-xl">No transactions yet. Start by adding one!</p>
            </div>
  `;
  return;
  }

  transactions.forEach(transaction => {
  transactionHistory.appendChild(createtransactionCard(transaction));
  });
}

function clearForm(){
  amountInput.value = '';
  descriptionInput.value = '';
  dateInput.valueAsDate = new Date();
  document.querySelectorAll('input[name="type"]').forEach(input => input.checked = false);
}

function saveToLocalStorage(){
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

window.editTransaction = editTransaction;
window.confirmDelete  = confirmDelete;
window.deleteTransaction = deleteTransaction;

updateStatistic();