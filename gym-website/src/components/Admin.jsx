import { useEffect, useState } from "react";
export default function Admin() {
    const [leads, setLeads] = useState([]);
    const totalLeads = leads.length;
    const todayLeads = leads.length;
    const contacted = 0;
    const pending = leads.length;
    useEffect(() => {
        fetch("http://localhost:8080/api/leads").then((response) => response.json()).then((data) => setLeads(data))
            .catch((error) => console.log(error));
    }, []);
    function DashboardCard({ title, value }) {
        return (
            <div style={{
                background: "#1e293b",
                padding: "30px",
                borderRadius: "12px",
                textAlign: "left",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                transition: "0.3s"
            }}>
                <h3 style={{
                    color: "#94a3b8",
                    marginBottom: "15px",
                    fontSize: "18px"
                }}>
                    {title}
                </h3>
                <h1 style={{
                    fontSize: "42px",
                    color: "#22c55e"
                }}>
                    {value}
                </h1>

            </div>
        );
    }
    return (
        <section>
            <div className="container">
                <h2 style={{
                    fontSize: "40px",
                    marginBottom: "40px"
                }}>Admin Dashboard</h2>
                <div style={{
                    overflowX: "auto"
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginBottom: "40px"
                    }}>
                        <DashboardCard title="Total Leads" value={totalLeads} />
                        <DashboardCard title="Today Leads" value={todayLeads} />
                        <DashboardCard title="Contacted" value={contacted} />
                        <DashboardCard title="Pending" value={pending} />
                    </div>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "#1e293b",
                        borderRadius: "10px",
                        overflow: "hidden"
                    }}>
                        <thead>
                            <tr style={{
                                background: "#22c55e"
                            }}>
                                <th style={tableStyle}>Name</th>
                                <th style={tableStyle}>Email</th>
                                <th style={tableStyle}>Phone</th>
                                <th style={tableStyle}>Subject</th>
                                <th style={tableStyle}>Message</th>
                                <th style={tableStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td style={tableStyle}>{lead.name}</td>
                                        <td style={tableStyle}>{lead.email}</td>
                                        <td style={tableStyle}>{lead.phone}</td>
                                        <td style={tableStyle}>{lead.subject}</td>
                                        <td style={tableStyle}>{lead.message}</td>
                                        <td style={tableStyle}>
                                            <span style={{
                                                background: "#facc15",
                                                color: "#000",
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                fontWeight: "bold",
                                                fontSize: "14px"
                                            }}>
                                                New
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
const tableStyle = {
    padding: "15px",
    borderBottom: "1px solid #334155",
    textAlign: "left"
};