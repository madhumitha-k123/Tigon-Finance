const pool = require("./db");
const cors = require("cors");
const express = require("express");
const Razorpay = require('razorpay');
const PDFDocument = require('pdfkit');
const app = express();

app.use(express.json());
app.use(cors());

// Razorpay client will use environment variables. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


app.post("/add-expense", async (req, res) => {
  const { amount, category } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ message: "Invalid expense data" });
  }

  try {
    await pool.query(
      "INSERT INTO expenses (amount, category) VALUES ($1, $2)",
      [amount, category]
    );

    const result = await pool.query("SELECT * FROM expenses ORDER BY id ASC");

    res.json({
      message: "Expense added successfully",
      expenses: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/set-income", async (req, res) => {
  const { amount, month } = req.body;

  if (!amount || !month) {
    return res.status(400).json({ message: "Invalid income data" });
  }

  try {
    // Upsert logic: delete existing month, then insert
    await pool.query("DELETE FROM income WHERE month = $1", [month]);

    await pool.query(
      "INSERT INTO income (amount, month) VALUES ($1, $2)",
      [amount, month]
    );

    res.json({ message: "Income saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/income", async (req, res) => {
  const { month } = req.query;

  try {
    const result = await pool.query(
      "SELECT amount FROM income WHERE month = $1",
      [month]
    );

    if (result.rows.length === 0) {
      return res.json({ amount: 0 });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
// Temp
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Create Razorpay order
app.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  if (!amount) return res.status(400).json({ error: 'Missing amount' });
  try {
    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json({ order, key_id: process.env.RAZORPAY_KEY_ID || '' });
  } catch (err) {
    console.error('Razorpay create order error', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment signature
app.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const crypto = require('crypto');
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', key_secret).update(body.toString()).digest('hex');
  if (expectedSignature === razorpay_signature) {
    // mark payment as verified (could persist to DB)
    res.json({ ok: true });
  } else {
    res.status(400).json({ ok: false, message: 'Invalid signature' });
  }
});

// Simple invoice PDF generator
app.get('/invoice/:userId', (req, res) => {
  const userId = req.params.userId;
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice_${userId}.pdf`);

  doc.fontSize(20).text('Tigon Finance', { align: 'left' });
  doc.moveDown();
  doc.fontSize(14).text(`Invoice for User: ${userId}`);
  doc.moveDown();
  doc.fontSize(12).text('Description: Premium Annual Plan');
  doc.text('Amount: ₹2000.00');
  doc.moveDown();
  doc.text(`Date: ${new Date().toLocaleString()}`);

  doc.end();
  doc.pipe(res);
});
