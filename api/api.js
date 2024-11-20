import axios from "axios";


const getCurrentMonthYear = () => {
  const date = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = months[date.getMonth()];
  const currentYear = date.getFullYear();
  return { currentMonth, currentYear };
};


const getAllCommitteMember = async () => {
  try {
    const { data } = await axios.get('https://committee-mobile-app-backend.vercel.app/api/v1/auth/getAllMember');
    return data; 
  } catch (error) {
    console.log(error);
    return null; 
  }
};


const getAllMemberMonthlyPaymentDetails = async ()=>{
  try {
    const { data } = await axios.get('https://committee-mobile-app-backend.vercel.app/api/v1/auth/getAllMemberMonthlyPaymentDetails');
    return data; 
  } catch (error) {
    console.log(error);
    return null; 
  }
}

const getAllHafizMonthlyPaymentDetails = async ()=>{
  try {
    const { data } = await axios.get('https://committee-mobile-app-backend.vercel.app/api/v1/auth/getAllHafizMonthlyPaymentDetails');
    return data; 
  } catch (error) {
    console.log(error);
    return null; 
  }
}


const getAllMemberCurrentMonthlyPaymentDetails = async () => {
  try {
    const { data } = await axios.get('https://committee-mobile-app-backend.vercel.app/api/v1/auth/getAllMemberCurrentMonthlyPaymentDetails');
    return data; 
  } catch (error) {
    console.log(error);
    return null; 
  }
}

const membersAmountCalculator = async () => {
  let amount = 0;
  const res = await getAllMemberMonthlyPaymentDetails();
  res.forEach((item) => {
    let memberAmount = parseInt(item.amount); 
    amount += memberAmount;
  });
  
  return amount; 
};


const hafizAmountCalculator = async () => {
  let amount = 0;
  const res = await getAllHafizMonthlyPaymentDetails();
  res.forEach((item) => {
    let memberAmount = parseInt(item.amount); 
    amount += memberAmount;
  });
  
  return amount; 
};


const getAllOthersPaymentDetails = async () => {
  try {
    const { data } = await axios.get('https://committee-mobile-app-backend.vercel.app/api/v1/auth/getAllOthersPayment');
    return data; 
  } catch (error) {
    console.log(error);
    return null; 
  }
}


const othersAmountCalculator = async () => {
  let amount = 0;
  const res = await getAllOthersPaymentDetails();
  res.forEach((item) => {
    let memberAmount = parseInt(item.amount); 
    amount += memberAmount;
  });
  
  return amount; 
};


const deleteOthersPayment = async (id) => {
  console.log(id, "id passed");
  try {
    const res = await axios.delete('https://committee-mobile-app-backend.vercel.app/api/v1/auth/handleOthersPaymentsDelete', {
      data: { _id: id } 
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting payment: ", error);
    return error;
  }
};

const updateOthersPaymentDetails = async (data)=>{
  try {
     const {_id, amount, notes} = data;
     const response = await axios.put('https://committee-mobile-app-backend.vercel.app/api/v1/auth/handleOthersPaymentsUpdate', {
      _id: _id,
      amount: amount,
      notes: notes,
    });
    console.log(response, "response Data")
    return response.data;
    
  } catch (error) {
    console.log(error, "Error while update")
      return error;
  }
}

const handleMemberDelete = async (id)=>{
  console.log(id, "id passed for member Delete");
  try {
    const res = await axios.delete('https://committee-mobile-app-backend.vercel.app/api/v1/auth/handleMemberDelete', {
      data: { _id: id } 
    });
    console.log(res)
    return res;
  } catch (error) {
    console.log(error, "consile")
    throw error
  }
}


const getMemberProfileData = async (id) => {
  console.log(id, "userID for profile data");
  try {
    const res = await axios.get(`https://committee-mobile-app-backend.vercel.app/api/v1/auth/getMemberProfile`, {
      params: { _id: id }  
    });
    console.log(res.data, "res data");
    return res.data;
  } catch (error) {
    throw error;
  }
};




export { getAllCommitteMember,
   getAllMemberMonthlyPaymentDetails, 
   getAllHafizMonthlyPaymentDetails, 
   getAllMemberCurrentMonthlyPaymentDetails, 
   membersAmountCalculator,
   hafizAmountCalculator,
   getCurrentMonthYear,
   getAllOthersPaymentDetails,
   deleteOthersPayment,
   updateOthersPaymentDetails,
   handleMemberDelete,
   getMemberProfileData,
   othersAmountCalculator
  };
