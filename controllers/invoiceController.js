const Invoice = require('../models/Invoice');

exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json({ invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ InvoiceId: req.params.id });
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({ invoice });
    } catch (error) {
        console.error('Error fetching invoice:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createInvoice = async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        const savedInvoice = await newInvoice.save();
        res.status(201).json({ message: 'Invoice created successfully', invoiceId: savedInvoice.id });
    } catch (error) {
        console.error('Error creating invoice:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInvoice = await Invoice.findOneAndUpdate({ InvoiceId: id }, req.body, { new: true });
        if (!updatedInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({ updatedInvoice });
    } catch (error) {
        console.error('Error updating invoice:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInvoice = await Invoice.findOneAndDelete({ InvoiceId: id });
        if (!deletedInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error deleting invoice:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};