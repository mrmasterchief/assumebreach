"use client";
import React, { useState } from "react";
import { showMessage } from "@/components/messages/Message";
import FormTemplate from "@/components/form/Form";
import ContentContainer from "@/components/content-container";
import { indexFunction } from "@/hooks";
import { useCTF } from "@/context/CtfContext";
import { resetCTFPassword } from "@/hooks/user";

export default function ForgotPassword() {
  const { ctfOpen } = useCTF();
  const [formType, setFormType] = useState<"forgotPassword" | "forgotPassword2">("forgotPassword");
  const [correctEmail, setCorrectEmail] = useState(false);
  const [email, setEmail] = useState("");
  const randomSecurityQuestions = [
    "What is your favorite color?",
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What is your favorite food?",
    "What city were you born in?",
    "What is your favorite movie?",
  ];
  const randomQuestion = randomSecurityQuestions[Math.floor(Math.random() * randomSecurityQuestions.length)];

  



  const handleFormSubmit = async (values: 
    {
    forgotPassword: {
      email: string;
    };
    forgotPassword2: {
      securityQuestion: string;
      newPassword: string;
    };
  }
  ) => {
    if(formType == "forgotPassword" && values.forgotPassword.email == process.env.NEXT_PUBLIC_HACKABLE_EMAIL!) {
      setCorrectEmail(true);
      setEmail(values.forgotPassword.email);
      setFormType("forgotPassword2");
      return;
    }
    if(formType == "forgotPassword" && values.forgotPassword.email != process.env.NEXT_PUBLIC_HACKABLE_EMAIL!) {
        setFormType("forgotPassword2");
        return
    }

    if(formType == "forgotPassword2" && values.forgotPassword2.securityQuestion && correctEmail) {
        try{
            await indexFunction(
                [
                    () => resetCTFPassword(email, values.forgotPassword2.securityQuestion, values.forgotPassword2.newPassword)
                ],
                ([ctfResult]) => {
                    if (!ctfResult) {
                        showMessage("Error", "Error resetting password", "error");
                        return;
                    }
                    if(ctfResult.flag) {
                        showMessage("Success", "OSINT Flag found. You can log in with this account now " + ctfResult.flag, "success");
                    }
                },
                false
            );
        }catch (error) {
            console.error(error);
            showMessage("Error", "Error resetting password", "error");
            return;
        }
    }
    if(formType == "forgotPassword2" && values.forgotPassword2.securityQuestion && !correctEmail) {
        showMessage("Error", "Incorrect email or security question", "error");
        return;
    }
    

   
  };

  return (
    <>
        <ContentContainer>
        <div className="w-[90%] md:w-[50%] mx-auto flex flex-col justify-center py-8 gap-4">
        <h1 className="font-bold text-black text-xl text-center animate-pulse duration-1000 ease-in-out"> 
          Forgot Password
        </h1>
        {formType == "forgotPassword2" && (
                <p className="text-center text-gray-800">
                    {correctEmail ? process.env.NEXT_PUBLIC_SECURITY_QUESTION : randomQuestion}
                </p>
        )}
          <FormTemplate
                formType={formType}
                onSubmit={handleFormSubmit}
                ctfOpen={ctfOpen}
            />
            </div>

        </ContentContainer>
   
    </>
  );
}
