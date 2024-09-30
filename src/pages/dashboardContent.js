import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import adam from "./assets/adam.png";
import axios from "axios";

export default function DashboardContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState([]);

  const fetchDetails = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const key = localStorage.getItem("key");

    if (!key) {
      alert("Key not found beta...");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://sea-turtle-app-k7x99.ondigitalocean.app/api/userProfile/`,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      console.log("response: ", response);
      console.log("responseData: ", response?.data);

      if (response?.data) {
        setUserDetails(response?.data);
        console.log("userDetails: ", userDetails);

        localStorage.setItem("user_type", response?.data?.user_type);
        localStorage.setItem("id", response?.data?.id);
      } else {
        setUserDetails([]);
      }
    } catch (error) {
      console.log("Error occurred: ", error);
      alert("No Patient data found...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-evenly items-center w-full h-screen md:p-10 md:px-20">
      <div className="left md:w-2/5 max-md:text-center">
        <span className="text-[40px] font-bold font-serif leading-6">
          Hey {userDetails?.username}...
        </span>
        <p className="text-[16px] sm:text-[20px] font-semibold">how r u doing today?</p>
        <p>Seems like a little tough day!</p>
        <p>No worries, here is what you can do to make it better...</p>
      </div>
      <div className="right md:w-3/5 items-center flex flex-col text-center">
        <img src={adam} className=""></img>
        {userDetails && (
          <div className="text-[14px] sm:text-[20px]">
            <div>
              <strong>Name: </strong>
              <span>{userDetails?.username}</span>
            </div>
            <div>
              <strong>Institution: </strong>
              <span>{userDetails?.institution_name}</span>
            </div>
            <div>
              <strong>Experience: </strong>
              <span>{userDetails?.experience}</span>
            </div>
            <div>
              <strong>Specialization: </strong>
              <span>{userDetails?.specialisation}</span>
            </div>
            <div>
              <strong>Date Joined: </strong>
              <span>{userDetails?.date_joined?.slice(0, 10)}</span>
            </div>
            <div>
              <strong>UserType: </strong>
              <span>{userDetails?.user_type}</span>
            </div>
          </div>
        )}
        {isLoading && <span>Loading...</span>}
      </div>

      {/* <Outlet /> */}
    </div>
  );
}
