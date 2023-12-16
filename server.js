
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    host: "127.0.0.1",
    port: "5432",
    user: "postgres",
    password: "JoshinSingh",
    database: "emergency_waitlist"
});

app.get('/patients', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM PATIENTS');
        res.json(result.rows);
        client.release();
    } catch (err) {
        res.status(500).send('Server error');
        console.error('Database error', err.stack);
    }
});

app.post('/patients', async (req, res) => {
    try {
        const { card_number, name, gender, date_of_birth, medical_issue, arrival_time, priority_id, room_id } = req.body;
        const client = await pool.connect();
        const query = 'INSERT INTO Patients (card_number, name, gender, date_of_birth, medical_issue, arrival_time, priority_id, room_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
        const result = await client.query(query, [card_number, name, gender, date_of_birth, medical_issue, arrival_time, priority_id, room_id]);
        res.json(result.rows[0]);
        client.release();
    } catch (err) {
        res.status(500).send('Server error');
        console.error('Database error', err.stack);
    }
});

app.get('/patients/:patient_id', async (req, res) => {
    try {
        const { patient_id } = req.params;
        const client = await pool.connect();
        const query = 'SELECT * FROM Patients WHERE patient_id = $1';
        const result = await client.query(query, [patient_id]);
        if (result.rows.length === 0) {
            res.status(404).send('Patient not found');
        } else {
            res.json(result.rows[0]);
        }
        client.release();
    } catch (err) {
        res.status(500).send('Server error');
        console.error('Database error', err.stack);
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});