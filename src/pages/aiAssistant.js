import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

import AddPatientModal from "../components/addPatientModal";
import ChatBot from "../components/chatBot";

export default function AiAssistant() {
  const navigate = useNavigate();

  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [addPatientModal, setAddPatientModel] = useState(false);
  const [searchPatient, setSearchPatient] = useState("");
  const [patientDetails, setPatientDetails] = useState([]);

  const [patientSummary, setPatientSummary] = useState("");
  const [patientTags, setPatientTags] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchPatients = async (searchQuery = "") => {
    if (isLoading) return;
    setIsLoading(true);
    const key = localStorage.getItem("key");

    if (!key) {
      alert("Key not found...");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://sea-turtle-app-k7x99.ondigitalocean.app/api/patients/?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      if (response?.data) {
        setPatientList(response?.data);
      } else {
        setPatientList([]);
      }
    } catch (error) {
      console.log("Error occurred: ", error);
      alert("No Patient data found...");
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery) => fetchPatients(searchQuery), 500),
    []
  );

  useEffect(() => {
    if (searchPatient) {
      debouncedSearch(searchPatient);
    } else {
      fetchPatients();
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchPatient, debouncedSearch]);

  const fetchPatientSummary = async (patientId) => {
    setSummaryLoading(true);
    const key = localStorage.getItem("key");

    console.log("key: ", key);

    const data = {
      id: patientId,
    };
    console.log("data: ", data);

    try {
      const response = await axios.get(
        `https://sea-turtle-app-k7x99.ondigitalocean.app/api/records/18`, // Passing patient_id as a query parameter
        {
          headers: {
            Authorization: `Token ${key}`, // Include the Authorization header
          },
        }
      );

      console.log("response:", response);

      console.log("responseData: ", response?.data);

      if (response?.data) {
        const data = response.data;
        setPatientDetails(data);
      }

      console.log("PatientDetails: ", patientDetails);

      setPatientSummary(response.data[0]?.summary || "Summary not available");
      setPatientTags(response?.data[0]?.tags);
    } catch (error) {
      console.log("Error fetching patient summary: ", error);
      setPatientSummary("Failed to fetch summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handlePatientClick = async (index) => {
    const selectedPatient = patientList[index];
    setSelectedPatient(selectedPatient);
    fetchPatientSummary(selectedPatient.id);
  };

  // Function to highlight matched text
  const highlightMatch = (name, query) => {
    if (!query) return name;
    const parts = name.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-blue-300 p-1">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="page2 flex flex-col sm:flex-row gap-20 p-10 sm:p-5 w-screen ">
      <div className="left flex flex-col gap-5  ">
        <span className="text-[20px] font-serif font-semibold">
          Patients Details
        </span>

        <div className="flex gap-10">
          <input
            placeholder="Search Patient"
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            className="p-2 w-96 rounded-lg border border-slate-400"
          />
        </div>
        <div className="container flex gap-10">
          <div className="w-full">
            <div className="flex flex-col gap-2 sm:w-96">
              {patientList.length > 0 ? (
                patientList?.map((patient, index) => (
                  <div
                    key={index}
                    className="bg-slate-200 p-3 rounded-lg cursor-pointer hover:bg-slate-300 transition-all"
                    onClick={() => handlePatientClick(index)}
                  >
                    <span>{highlightMatch(patient.name, searchPatient)}</span>
                  </div>
                ))
              ) : (
                <>{!isLoading && <span>No Patient Data</span>}</>
              )}
            </div>
            <div>{isLoading && <span>Fetching Data...</span>}</div>
          </div>
        </div>
      </div>
      <div className="right sm:w-1/2 rounded-2xl">
          <ChatBot id={selectedPatient?.id} name={selectedPatient?.name}/>
        </div>
      {addPatientModal && (
        <AddPatientModal onClose={() => setAddPatientModel(false)} />
      )}
    </div>
  );
}
