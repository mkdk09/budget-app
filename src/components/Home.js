import React, { useState, useContext, useEffect } from 'react';
import { db } from "../firebase/Firebase";

import { AuthContext } from '../auth/AuthProvider';

import firebase from "firebase/app";
import "firebase/firestore";

function Home () {
  const [inputText, setInputText] = useState("");
  const [inputAmount, setInputAmount] = useState(0);
  const [incomeItems, setIncomeItems] = useState([]);
  const [expenseItems, setExpenseItems] = useState([]);
  const [type, setType] = useState("inc")
  const [date, setDate] = useState(new Date());

  const { currentUser } = useContext(AuthContext);

  useEffect (() => {
    getIncomeData();
    getExpenseData();
  }, []);

  useEffect(() => {
    getIncomeData();
    getExpenseData();
  }, [date]);

  //Firestoreから収入データを取ってきて、アプリ上で表示
  const getIncomeData = () => {
    const incomeData = db.collection('incomeItems')
    incomeData.where('uid', '==', currentUser.uid).orderBy('date').startAt(startOfMonth(date)).endAt(endOfMonth(date)).onSnapshot(query => {
      const incomeItems = []
      query.forEach(doc => incomeItems.push({...doc.data(), docId: doc.id}));
      setIncomeItems(incomeItems);
    });
  }

  //FireStoreに収入データを追加
  const addIncome = (text, amount) => {
    const docId = Math.random().toString(32).substring(2);
    const date = firebase.firestore.Timestamp.now()
    db.collection('incomeItems').doc(docId).set({
      uid: currentUser.uid,
      text,
      amount,
      date,
    })
    .then(response => {
      setIncomeItems([
        ...incomeItems, {text: inputText, amount: inputAmount, docId: docId, date: date}
      ]);
    });
  };

  //Firestoreから出費データを取ってきて、アプリ上で表示
  const getExpenseData = () => {
    const expenseData = db.collection('expenseItems')
    expenseData.where('uid', '==', currentUser.uid).orderBy('date').startAt(startOfMonth(date)).endAt(endOfMonth(date)).onSnapshot(query => {
      const expenseItems = []
      query.forEach(doc => expenseItems.push({...doc.data(), docId: doc.id}))
      setExpenseItems(expenseItems);
    });
  }

  //FireStoreに出費データを追加
  const addExpense = (text, amount) => {
    const docId = Math.random().toString(32).substring(2);
    const date = firebase.firestore.Timestamp.now();
    db.collection('expenseItems').doc(docId).set({
      uid: currentUser.uid,
      text,
      amount,
      date,
    })
    .then(response => {
      setExpenseItems([
        ...expenseItems, {text: inputText, amount:inputAmount, docId: docId, date: date}
      ]); 
    });
  }

};

export default Home;