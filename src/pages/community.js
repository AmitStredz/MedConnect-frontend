import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";

import CommentModal from "../components/commentModal";
import CreatePostModal from "../components/createPostModal";

import { FaRegComment } from "react-icons/fa";
import adam from "./assets/adam.png";

export default function Community({ triggerFetch }) {
  console.log("Community...");
  const [data, setData] = useState([]);
  const [commentModalData, setCommentModalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openCreatePostModal, setOpenCreatePostModal] = useState(false);

  const fetchData = async () => {
    const key = localStorage.getItem("key");

    if (!key) {
      alert("Key not found...");
      return;
    }
    try {
      const response = await axios.get(
        "https://sea-turtle-app-k7x99.ondigitalocean.app/api/posts/",
        {
          Headers: {
            Authentication: `Token ${key}`,
          },
        }
      );
      console.log("response: ", response);
      console.log("responseData: ", response?.data);
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCommentClick = (data) => {
    console.log("comment data: ", data);
    setCommentModalData(data);
    setOpenCommentModal(true);
  };

  const handleTriggerFetch = () => {};
  return (
    <div className="flex flex-col gap-5 p-10 sm:p-5">
      <div>
        <button
          className="p-2 px-4 rounded-lg bg-gradient-to-r from-[#aae090be] to-[#48ba4acf]"
          onClick={() => setOpenCreatePostModal(true)}
        >
          + Create Post
        </button>
      </div>
      {data.length > 0 ? (
        <div className="flex flex-wrap gap-5">
          {data.map((data, index) => (
            <div
              key={index}
              onClick={() => handleCommentClick(data)}
              className="flex flex-col gap-3 bg-slate-300 bg-opacity-50 max-w-[20rem] h-full rounded-md w- overflow-auto hide-scrollbar cursor-pointer hover:bg-opacity-70"
            >
              <div className=" p-2 px-3 hover:underline cursor-pointer bg-opacity-30">
                <div className="flex justify-between">
                  <strong>{data.title}</strong>
                  <div className="flex items-center ">
                    <p className="px-1 text-[12px] ">{data.author}</p>
                    <img src={adam} className="w-8 h-8  "></img>
                  </div>
                </div>
                <div className="h-[1px] w-full bg-black"></div>
              </div>
              <p className="text-slate-500 px-3">{data.desc}</p>

              <div className="p-1">
                <div className="h-[.1px] w-full bg-black"></div>
                <div className="flex justify-between p-1 px-3 items-center text-[12px] 0 bg-opacity-30">
                  <div className="flex gap-3">
                    <span className="flex items-center">
                      <BiLike />
                      230k
                    </span>
                    <span className="flex items-center">
                      <BiDislike />
                      12k
                    </span>
                    <span className="flex items-center">
                      <FaRegComment
                        // size={25}
                        className="cursor-pointer hover:scale-110"
                      />
                      123k
                    </span>
                  </div>
                  <span>{data.date.slice(0, 10)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>No posts yet...</>
      )}
      {openCommentModal && (
        <CommentModal
          fetchData={fetchData}
          data={commentModalData}
          onClose={() => setOpenCommentModal(false)}
        />
      )}
      {openCreatePostModal && (
        <CreatePostModal
          // data={commentModalData}
          fetchData={fetchData}

          onClose={() => setOpenCreatePostModal(false)}
        />
      )}
    </div>
  );
}
