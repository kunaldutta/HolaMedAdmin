import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const userId = '16'; // Replace with dynamic value if needed
  const [globalAddressDetail, setGlobalAddressDetail] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressloading, setaddressloading] = useState(false);

  const fetchAddresses = async () => {
    setaddressloading(true);
    setAddresses([]);
    try {
      const response = await axios.get('https://developersdumka.in/ourmarket/Medicine/get_addresses.php', {
        params: { usr_id: userId },
      });
      
      if (response.status === 200 && response.data.success) {
        console.log('Address fetch response:', response.data.addresses.length);
        if (response.data.addresses.length === 0) {
          const tadd = {user_name: "Not Found",};
        setGlobalAddressDetail(tadd);
        }else {
        const sorted = response.data.addresses.sort((a, b) =>
          b.default_value.localeCompare(a.default_value) // 'Y' comes first
        );
        setAddresses(sorted);
        console.log('Sorted addresses:', sorted[0]);
        console.log('Sorted addresses:2', globalAddressDetail);
        const defaultAddr = sorted.find(addr => addr.default_value === 'Y') || sorted[0];
        // if(sorted.length === 1){
        // setGlobalAddressDetail(defaultAddr);
        // console.log('Default address set:', defaultAddr);
        // }
        if((globalAddressDetail !== null && globalAddressDetail.length === 0) || (globalAddressDetail === null) || (globalAddressDetail.user_name === "Not Found")){
        setGlobalAddressDetail(defaultAddr);
        }
      }
        
      } else {
        const tadd = {user_name: "Not Found",};
        setGlobalAddressDetail(tadd);
        console.warn('Failed to fetch addresses');
      }
    } catch (error) {
      const tadd = {user_name: "Not Found",};
      setGlobalAddressDetail(tadd);
      console.error('Address fetch error:', error);
    } finally {
      setaddressloading(false);
    }
  };

  return (
    <AddressContext.Provider
      value={{
        globalAddressDetail,
        setGlobalAddressDetail,
        addresses,
        fetchAddresses,
        addressloading,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
