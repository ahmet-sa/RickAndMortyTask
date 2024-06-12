import React, { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import axiosInstance from '../../axios.config';

const EditDebtForm: React.FC<{ debtId: string, onSubmit: (updatedDebt: any) => void, onClose: () => void }> = ({ debtId, onSubmit, onClose }) => {
  const [updatedDebt, setUpdatedDebt] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/finance/debt/${debtId}`);
        const fetchedDebt = response.data.data;
        setUpdatedDebt(fetchedDebt);
        setAmount(calculateAmount(fetchedDebt.debtAmount, fetchedDebt.interestRate, fetchedDebt.installment));
      } catch (error) {
        console.error('Error fetching debt details:', error);
      }
    };

    fetchData();
  }, [debtId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/finance/debt/${debtId}`, updatedDebt);
      onSubmit(updatedDebt);
    } catch (error) {
      console.error('Error updating debt:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedValue = value;
    // If the changed field is debtAmount, interestRate, or installment, update the amount
    if (name === 'debtAmount' || name === 'interestRate' || name === 'installment') {
      const parsedValue = parseFloat(value);
      updatedValue = parsedValue;
      setAmount(calculateAmount(
        name === 'debtAmount' ? parsedValue : updatedDebt.debtAmount,
        name === 'interestRate' ? parsedValue : updatedDebt.interestRate,
        name === 'installment' ? parsedValue : updatedDebt.installment
      ));
    }

    setUpdatedDebt(prevState => ({
      ...prevState,
      [name]: updatedValue
    }));
  };

  const calculateAmount = (debtAmount: number, interestRate: number, installment: number) => {
    if (debtAmount <= 0 || interestRate <= 0 || installment <= 0) {
      return 0;
    }
    const monthlyInterestRate = interestRate / 100;
    const totalPayment = debtAmount * Math.pow(1 + monthlyInterestRate, installment);
    return parseFloat(totalPayment.toFixed(2));
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Debt</DialogTitle>
        <DialogContent>
          {updatedDebt && (
            <div>
              <TextField
                name="debtName"
                label="Debt Name"
                value={updatedDebt.debtName}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="lenderName"
                label="Lender Name"
                value={updatedDebt.lenderName}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="debtAmount"
                label="Debt Amount"
                type="number"
                value={updatedDebt.debtAmount}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="interestRate"
                label="Interest Rate"
                type="number"
                value={updatedDebt.interestRate}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="amount"
                label="Amount"
                type="number"
                value={amount}
                disabled
                fullWidth
                margin="dense"
              />
              <TextField
                name="installment"
                label="Installment"
                type="number"
                value={updatedDebt.installment}
                onChange={handleChange}
                required
                fullWidth
                margin="dense"
              />
              <TextField
                name="description"
                label="Description"
                value={updatedDebt.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="dense"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">Save</Button>
          <Button onClick={onClose} color="primary">Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditDebtForm;