"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getUserInfo, postReview, getReviews } from "@/hooks/user";
import { indexFunction } from "@/hooks";
import { showMessage } from "@/components/messages/Message";
import TextField from "@mui/material/TextField";
import { Review } from "@/types/Review";
import { User } from "@/types/User";


export default function Reviews() {
  const [userDetails, setUserDetails] = useState<User>({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    created_at: "",
    updated_at: "",
    password_hash: "",
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewInput, setReviewInput] = useState<string>("");
  const [reviewPosted, setReviewPosted] = useState<boolean>(false);


  useEffect(() => {
    try {
      indexFunction(
        [
          () => getUserInfo({ unsafeID: localStorage.getItem("unsafeID") || "" }),
          () => getReviews(),
        ]
        ,
        ([userResults, reviewResults]) => {
          if (!userResults) {
            return;
          }
          const userDetails = {
            ...userResults.user,
            email: userResults.email,
          };
          setUserDetails(userDetails);
            reviewResults.sort((a: { created_at: string }, b: { created_at: string }) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
          setReviews(reviewResults);
        },
        true
      );
    } catch (error) {
      window.location.href = "/account/authenticate";
      console.error(error);
    }
  }, [reviewPosted]);

  const handlePostReview = async () => {
    if (!reviewInput) {
        showMessage("Error", "Please enter a review", "error");
        return;
    }
    try {
        await postReview(reviewInput);
        showMessage("Success", "Review posted successfully", "success");
        setReviewPosted(true);
        setReviewInput("");
    }
    catch (error) {
        console.error("Error posting review:", error);
    }
  };






  return (
    <div className="flex flex-col max-w-[1080px] mx-auto mt-10 gap-4">
        <div className="flex flex-col gap-4">
            {userDetails && (
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold">Welcome, {userDetails.full_name}</h1>
                    <p className="text-gray-500">
                        Email: {userDetails.email}
                    </p>
                <div className="flex flex-col gap-2 p-4 border border-gray-300 rounded-lg">
                    <TextField
                        label="Post a Review"
                        variant="outlined"
                        value={reviewInput}
                        onChange={(e) => setReviewInput(e.target.value)}
                        className="w-full"
                    />
                    <button
                        onClick={handlePostReview}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                    >
                        Post Review
                    </button>
                </div>
                </div>
            )}
            <h1 className="text-2xl font-semibold">Reviews</h1>
            <p className="text-gray-500">
                Here you can find all the reviews you have posted. You can also post a new review by clicking the button below.
            </p>
            {reviews && reviews.length > 0 ? (
                reviews.map((review: Review) => (
                    <div key={review.id} className="flex flex-col gap-2 p-4 border border-gray-300 rounded-lg">
                        <div dangerouslySetInnerHTML={{__html: review.html}} className="text-gray-700 max-w-[100%] overflow-hidden" />
                        
                        <p className="text-gray-500">Posted on: {new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No reviews found.</p>
            )}
            
            
            </div>
    
      <h1 className="text-2xl mt-4 font-semibold">Got questions?</h1>
      <div className="flex flex-row gap-2 pb-10">
        <p className="text-gray-500">
          You can find frequently asked questions and answers on our customer
          service page.
        </p>
        <Link href="/customer-service" passHref className="flex flex-row gap-2">
          <p className="text-blue-700 hover:underline">Customer Service</p>
          <Icon
            icon="material-symbols:arrow-outward-rounded"
            className="text-blue-700 transition-all transform hover:rotate-45"
          />
        </Link>
      </div>
    </div>
  );
}
