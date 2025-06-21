import React from 'react'
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
const Transactions = ( {
  Transaction,
  addTransaction,
  editTransaction,
  deleteTransaction
}) => {
  return (
    <div>
      <TransactionForm addTransaction={addTransaction}/>
      <TransactionList 
      transactions={transactions}
        deleteTransaction={deleteTransaction}
        editTransaction={editTransaction}
        />
    </div>
  )
}

export default Transactions