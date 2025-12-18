import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import CreateItemForm from "../components/create_item_form.jsx";

function CreateItem() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = location.state?.token || localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    if (!token) {
        return null;
    }

    return <CreateItemForm token={token} />;
}

export default CreateItem;