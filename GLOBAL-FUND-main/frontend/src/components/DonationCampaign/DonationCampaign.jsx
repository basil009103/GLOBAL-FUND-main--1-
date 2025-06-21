import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer";

const DonationCampaign = () => {
  const [tab, setTab] = useState("domestic");
  const [domesticCampaigns, setDomesticCampaigns] = useState([]);
  const [internationalCampaigns, setInternationalCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDomestic = JSON.parse(localStorage.getItem("domesticCampaigns"));
    const storedInternational = JSON.parse(localStorage.getItem("internationalCampaigns"));

    if (storedDomestic && storedDomestic.length > 0) {
      setDomesticCampaigns(storedDomestic);
    } else {
      // initial domestic campaigns
      const initialDomestic = [
        {
          _id: "d1",
          title: "Education for All",
          description: "Support primary education in rural areas.",
          goal: 500000,
          urgency: "Urgent",
          deadline: "July 20, 2025",
          currency: "PKR",
          beneficiaryInfo: `• Build classrooms\n• Provide school supplies\n• Hire teachers`,
        },
        {
          _id: "d2",
          title: "Flood Relief Punjab",
          description: "Help families recover from severe flooding.",
          goal: 1000000,
          urgency: "Emergency",
          deadline: "June 30, 2025",
          currency: "PKR",
          beneficiaryInfo: `• Shelter kits\n• Clean water\n• Hygiene supplies`,
        },
        {
          _id: "d3",
          title: "Orphan Support Fund",
          description: "Sponsor meals and education for orphans.",
          goal: 600000,
          urgency: "High",
          deadline: "August 15, 2025",
          currency: "PKR",
          beneficiaryInfo: `• Monthly stipends\n• Health checkups\n• Mentorship`,
        },
        {
          _id: "d4",
          title: "Water Wells in Thar",
          description: "Install solar-powered water wells.",
          goal: 800000,
          urgency: "Critical",
          deadline: "July 10, 2025",
          currency: "PKR",
          beneficiaryInfo: `• Bore wells\n• Solar pumps\n• Filtration units`,
        },
        {
          _id: "d5",
          title: "Women Empowerment",
          description: "Train women in tailoring & digital skills.",
          goal: 400000,
          urgency: "Normal",
          deadline: "Sept 1, 2025",
          currency: "PKR",
          beneficiaryInfo: `• Skills training\n• Micro-loans\n• Equipment`,
        },
        {
          _id: "d6",
          title: "Mobile Health Clinic",
          description: "Fund mobile clinics for remote villages.",
          goal: 950000,
          urgency: "High",
          deadline: "August 5, 2025",
          currency: "PKR",
          beneficiaryInfo: `• Doctor visits\n• Free medicines\n• Health awareness`,
        },
      ];
      setDomesticCampaigns(initialDomestic);
      localStorage.setItem("domesticCampaigns", JSON.stringify(initialDomestic));
    }

    if (storedInternational && storedInternational.length > 0) {
      setInternationalCampaigns(storedInternational);
    } else {
      // initial international campaigns
      const initialInternational = [
        {
          _id: "i1",
          title: "Earthquake Relief in Turkey",
          description: "Help families rebuild homes after disaster.",
          goal: 40000,
          urgency: "Emergency",
          deadline: "July 25, 2025",
          currency: "USD",
          beneficiaryInfo: `• Temporary shelters\n• Medical support\n• Food kits`,
        },
        {
          _id: "i2",
          title: "Support Gaza Families",
          description: "Provide urgent aid to displaced families.",
          goal: 30000,
          urgency: "Critical",
          deadline: "July 10, 2025",
          currency: "USD",
          beneficiaryInfo: `• Food parcels\n• Clean water\n• Emergency care`,
        },
        {
          _id: "i3",
          title: "Ukraine Education Relief",
          description: "Fund online schooling for war-affected children.",
          goal: 25000,
          urgency: "High",
          deadline: "August 1, 2025",
          currency: "USD",
          beneficiaryInfo: `• Tablets\n• Online access\n• Teaching support`,
        },
        {
          _id: "i4",
          title: "Africa Malaria Drive",
          description: "Distribute mosquito nets and medical aid.",
          goal: 35000,
          urgency: "Normal",
          deadline: "August 15, 2025",
          currency: "USD",
          beneficiaryInfo: `• Nets\n• Medicine\n• Public awareness`,
        },
      ];
      setInternationalCampaigns(initialInternational);
      localStorage.setItem("internationalCampaigns", JSON.stringify(initialInternational));
    }
  }, []);

  const campaigns = tab === "domestic" ? domesticCampaigns : internationalCampaigns;

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-16 px-4 md:px-10 bg-orange-50">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold text-center text-orange-600 mb-12">
            Ongoing Donation Campaigns
          </h1>

          <div className="flex justify-center mb-8 gap-4">
            <button
              className={`px-6 py-2 rounded-full font-semibold border ${
                tab === "domestic"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-orange-600 border-orange-500"
              }`}
              onClick={() => setTab("domestic")}
            >
              Domestic
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold border ${
                tab === "international"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-orange-600 border-orange-500"
              }`}
              onClick={() => setTab("international")}
            >
              International
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="w-[330px] bg-white border rounded-2xl p-6 shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h2>
                <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                <p className="text-sm font-semibold mb-1 text-black">
                  Goal: <span className="text-orange-600">
                    {campaign.currency === "USD"
                      ? `$${campaign.goal.toLocaleString()}`
                      : `₨${campaign.goal.toLocaleString()}`}
                  </span>
                </p>
                <p className="text-xs text-red-600">
                  {campaign.urgency} — before {campaign.deadline}
                </p>
                <pre className="text-xs bg-orange-50 p-3 rounded mt-3 text-gray-700 whitespace-pre-wrap">
                  {campaign.beneficiaryInfo}
                </pre>
                <button
                  onClick={() => navigate(`/donate/${campaign._id}`, { state: campaign })}
                  className="w-full mt-4 bg-black text-white py-2 rounded-full font-semibold"
                >
                  Donate Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonationCampaign;
