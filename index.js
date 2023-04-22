const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer'); 
const db = require('./server.js');

const app = server.app;
const db = server.db;
const PORT = server.port; 

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.get