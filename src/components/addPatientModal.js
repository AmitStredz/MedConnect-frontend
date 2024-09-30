import axios from "axios";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const AddPatientModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [doctor, setDoctor] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handleAddPatient = async () => {
    if(isLoading) return;
    setIsLoading(true);

    const id = localStorage.getItem("id");
    if(!id){
      alert("id not found");
      setIsLoading(false);
      return;
    }
    const data = {
      name: name,
      age: age,
      gender: sex,
      doctor: id,
    };

    console.log("data: ", data);
    
    try {
      const response = await axios.post(
        "https://sea-turtle-app-k7x99.ondigitalocean.app/api/patients/",
        data
      );

      console.log("response: ", response);

      if (response) {
        console.log("id: ", response?.data?.id);
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          onClose();
        }, 2000);
        // onLogin(); // Call the onLogin function to update the authentication state
      } else {
        console.error("Invalid response data:", response.data);
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.log("Error occurred: ", error);
      alert("Invalid credentials. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="flex justify-center w-full fixed top-0 left-0 px-3 backdrop-blur-md z-[100] h-screen"
      data-aos="fade-in"
    >
      {!successModal ? (
        <div className="flex flex-col gap-10 my-20 bg-gradient-to-r from-[#7391cc5c] to-[#65b36baa] p-8 sm:p-10 rounded-3xl max-w-xl z-50">
          <div className="flex flex-col gap-10">
            <div className="flex justify-end">
              <IoClose onClick={onClose} size={40} className="cursor-pointer" />
            </div>
            <div className="flex flex-col gap-3 w-96 font-mono">
              <div className="flex flex-col">
                <label>Name</label>
                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-1 rounded-lg bg-slate-100 outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label>Age</label>
                <input
                  placeholder="enter age of patient"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="p-1 rounded-lg bg-slate-100 outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label>Sex</label>
                <input
                  placeholder="enter sex orientation of patient"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="p-1 rounded-lg bg-slate-100 outline-none"
                />
              </div>
              {/* <div className="flex flex-col">
                <label>Doctor</label>
                <input
                  placeholder="enter doctor assigned to patient"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="p-1 rounded-lg bg-slate-100 outline-none"
                />
              </div> */}
            </div>

            <div className="flex justify-center">
              <button
                className={`p-2 px-14 sm:px-20 rounded-2xl bg-gradient-to-r from-green-300 to-blue-400 cursor-pointer ${
                  isLoading ? "cursor-not-allowed" : ""
                }`}
                onClick={handleAddPatient}
                // disabled={isLoading} // Disable button when loading
              >
                {isLoading ? "Loading..." : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center h-screen w-screen items-center">
          <FaCheckCircle size={100} data-aos="zoom-in" color="green" />
        </div>
      )}
    </div>
  );
};
export default AddPatientModal;
