const express = require('express');
const { Model } = require('sequelize');
const { initDB } = require("./db");
const ToDo = require("./db/models/ToDo model")
const app = express(); 
const port = 3100;

app.use(express.json());

app.listen(port , () => {
    console.log('Application listening on port ' + port );
})

app.get('/sum', (req, res)=>{
    const a = req.body.a
    const b = req.body.b

    if ((a === String(a)) || (b === String(b))){
        res.json({message: "ERROR"})   
    } else {
        const sum = a + b
        res.json({ sum : sum})
    }
})

app.post("/reverse-case", (req, res)=>{
    const text_str = req.body.text
    let new_str = ''
    for (let i = 0; i < text_str.length - 1; i++) {
        let ch = text_str.charAt(i)
        if (ch === ch.toUpperCase()){
            ch = ch.toLowerCase()
        } else {
            ch = ch.toUpperCase()
        }
        new_str += ch
    }
    res.json({new_str: new_str})
})

app.put("/obj-to-array", (req, res)=>{
    const x = req.body.x
    const massKeys = Object.keys(x)
    const massValues = Object.values(x)
    console.log(massKeys, massValues)
    let mass = []
    for (let i = 0; i < massKeys.length ; i++){
        mass.push({
            "key": massKeys[i],
            "Value": massValues[i]
        })
    }
    res.json({mass: mass})
})

app.patch("/reverse-array", (req, res)=>{
    const arr = req.body.arr
    let reverse_arr = []
    let n = 0
    for (let i = arr.length - 1; i >= 0; i--){
        reverse_arr[n] = arr[i]
        n += 1
    }
    res.json({reverse_arr: reverse_arr})
})

app.delete("/delete", (req, res)=>{
    mass = req.body.mass
    const result = Array.from(new Set(mass))
    res.json({newmass: result })
})





initDB();

app.get("/api/todos", async (req, res)=>{
    try{
        const list = await ToDo.findAll();
        res.json( {ToDo: list} );
    } catch (error) {
        res.status(500).json({message: "ERROR"})
    }
})

app.get("/api/todos/id", async (req, res)=>{
    try{
        const singl_todo = await ToDo.findOne({where: {id: req.body.id}})
        res.json({ToDo: singl_todo})
    } catch (error) {
        res.status(500).json({message: "ERROR"})
    }
})

app.post("/api/todos", async (req, res)=>{
    try {
        const todo = await ToDo.create({
            title: req.body.title,
            description: req.body.description
        })
        res.json({todo: todo})
    } catch (error) {
        res.status(500).json({message: "ERROR"})
    }
})

app.patch("/api/todos/id", async (req, res) => {
    try{
        await ToDo.update({
            title: req.body.title,
            description: req.body.description
        },
        {
            where: {id: req.body.id}
        })
        res.json({message: "complete"})
    } catch (error) {
        res.status(500).json({message: "ERROR"})
    }
})

app.delete("/api/todos/id", async (req, res) => {
    try{
        await ToDo.destroy({where: {id: req.body.id}})
        res.json({message: "Complete"})
    } catch (error) {
        res.status(500).json({message: "ERROR"})
    }
})

app.delete("/api/todos", async (req, res) => {
    try {
        await ToDo.destroy({where: {}})
        res.json({message: "Complete"})
    } catch (error) {
        res.status(500).json({message: "ERROR"})
    }
})