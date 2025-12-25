// MedicineListScreen.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MedicineList from './MedicineList'; // Dumb UI component
import withLoading from '../withLoading'; // HOC for loading state

const MedicineListWithLoading = withLoading(MedicineList);

export default function MedicineListScreen(props) {
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://developersdumka.in/ourmarket/Medicine/getmedicine.php'
      );
      setFilteredItems(response.data?.data || []);
    } catch (error) {
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MedicineListWithLoading
      {...props}
      loading={loading}
      filteredItems={filteredItems}
    />
  );
}
