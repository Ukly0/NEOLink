import React, { useState, useContext } from "react";
import axios from 'axios';
import { base_url } from '../api';
import { AuthContext } from "./AuthContext";
import EmailForm from "./email_form";
import OTPForm from "./OTP_form";

const Auth = ({ accept_policy_message, privacy_policy }) => {
    const [email, setEmail] = useState("");
    const [error_message, setErrorMessage] = useState(null);
    const { setToken } = useContext(AuthContext);

    const handle_email_submit = async (email) => {
        setEmail(email);
        setErrorMessage(null);
        
        try {
            const response = await axios.post(`${base_url}/custom-seller/create`, {
                email,
            });
            setEmail(response.data.email);
        } catch (error) {
            console.error("Authentication failed:", error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        }
    };
    
    const handle_authentication = async (otp) => {
        setErrorMessage(null);
        
        try {
            const response = await axios.post(`${base_url}/custom-seller/active`, {
                email,
                otp,
            });
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            console.error("Authentication failed:", error);
            setToken(null);
            localStorage.removeItem("token");
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Invalid OTP. Please try again.");
            }
        }
    };

    return (
        <div>
            {error_message && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c2c7',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    color: '#842029'
                }}>
                    {error_message}
                </div>
            )}
            
            {!email && (
                <EmailForm 
                    onNext={handle_email_submit} 
                    privacy_policy={privacy_policy} 
                    accept_policy_message={accept_policy_message}
                />
            )}
            
            {email && <OTPForm onAuthenticate={handle_authentication} email={email} />}
        </div>
    );
};

export default Auth;