if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {

} else {
  localStorage.removeItem("transactions");
}

const popup = document.getElementById("popupModal");
const openPopupBtn = document.getElementById("openPopup");
const closePopupBtn = document.getElementById("closePopup");
const form = document.getElementById("transactionForm");

const incomeDisplay = document.getElementById("total-income");
const expenseDisplay = document.getElementById("total-expense");
const list = document.getElementById("transaction-list");

let totalIncome = 0;
let totalExpense = 0;
let transactions = [];

if (localStorage.getItem("transactions")) {
  transactions = JSON.parse(localStorage.getItem("transactions"));
  transactions.forEach(addTransactionToList);
  updateTotals();
}

openPopupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.add("active");
});


closePopupBtn.addEventListener("click", () => {
  popup.classList.remove("active");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const type = document.getElementById("type").value;
  const title = document.getElementById("title").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  if (title && amount > 0) {
    const transaction = { title, amount, type };
    transactions.push(transaction);
    addTransactionToList(transaction);
    updateTotals();
    saveData();
  }

  form.reset();
  popup.classList.remove("active");
});

function addTransactionToList({ title, amount, type }) {
  const transaction = document.createElement("div");
  transaction.classList.add("transaction");
  transaction.innerHTML = `
    <div class="icon" style="background-color: ${
      type === "income" ? "#f7d96f" : "#f7a5a5"
    }">
      <i class="${type === "income" ? "fas fa-coins" : "fas fa-utensils"}"></i>
    </div>
    <div class="details"><h4>${title}</h4></div>
    <div class="amount ${type === "income" ? "positive" : "negative"}">${
      type === "income" ? "+" : "-"
    }₹${amount}</div>
  `;
  list.prepend(transaction);
}

function updateTotals() {
  totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  incomeDisplay.textContent = `₹${totalIncome}`;
  expenseDisplay.textContent = `₹${totalExpense}`;
}

function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}


const reportModal = document.getElementById("reportModal");
const openReportBtn = document.getElementById("openReport");
const closeReportBtn = document.getElementById("closeReport");

openReportBtn.addEventListener("click", () => {
  updateReport();
  reportModal.classList.add("active");
});

closeReportBtn.addEventListener("click", () => {
  reportModal.classList.remove("active");
});

function updateReport() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  document.getElementById("reportIncome").textContent = `₹${income}`;
  document.getElementById("reportExpense").textContent = `₹${expense}`;
  document.getElementById("reportBalance").textContent = `₹${balance}`;

  const total = income + expense || 1;
  document.querySelector(".income-bar").style.width = `${(income / total) * 100}%`;
  document.querySelector(".expense-bar").style.width = `${(expense / total) * 100}%`;
}