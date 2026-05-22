import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { apiRequest } from "../util/api";
import "../style/PlanManagement.css";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "./AdminSidebar";

export default function PlanManagement() {
    const [plans, setPlans] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => {
        fetchPlans();
    }, []);
    const fetchPlans = async () => {
        try {
            const response = await apiRequest("/api/plans", "GET");
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch plans. Please try again later.");
        }
    }
    return (
        <div className="admin-container">
            <AdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                scrollToTop={() => { }}
                scrollToSection={() => { }}
                leadsRef={null}
                analyticsRef={null}
            />
            <div className="main-content">
                <button className="mobile-nav-toggle"
                    onClick={() =>
                        setIsSidebarOpen(!isSidebarOpen)
                    }
                    type="button">
                    ☰ {
                        isSidebarOpen
                            ? "Close Menu"
                            : "Open Menu"
                    }
                </button>
                <div className="plans-page">
                    <div className="plans-header">
                        <h1>Plan Management</h1>
                        <button className="add-plan-btn">Add Plan</button>
                    </div>
                    <div className="plans-table-wrapper">
                        <table className="plans-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Period</th>
                                    <th>Popular</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map((plan) => (
                                    <tr key={plan.id}>
                                        <td>{plan.id}</td>
                                        <td>{plan.name}</td>
                                        <td>{plan.description}</td>
                                        <td>{plan.price}</td>
                                        <td>{plan.period}</td>
                                        <td>
                                            {plan.popular ?
                                                (<span className="popular-yes">Yes</span>) : (<span className="popular-yes">"No"</span>
                                                )}
                                        </td>
                                        <td>
                                            <button>Edit</button>
                                            <button>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        theme="dark"
                    />
                </div>
            </div>
        </div>
    );
}
