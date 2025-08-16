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
    // Try fetching approved campaigns from backend first
    const fetchApproved = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/campaigns');
        if (!res.ok) throw new Error('Failed to fetch campaigns');
        const all = await res.json();
        // only show approved campaigns in the public list
        const approved = (all || []).filter((c) => c.status === 'approved');

        const dom = approved.filter((c) => c.currency === 'PKR');
        const intl = approved.filter((c) => c.currency === 'USD');

        if (dom.length > 0) {
          setDomesticCampaigns(dom);
          localStorage.setItem('domesticCampaigns', JSON.stringify(dom));
        }
        if (intl.length > 0) {
          setInternationalCampaigns(intl);
          localStorage.setItem('internationalCampaigns', JSON.stringify(intl));
        }

        // If backend returned nothing approved, fallback to localStorage/demo data below
        if (dom.length === 0 && intl.length === 0) {
          applyLocalFallback();
        }
      } catch (err) {
        console.warn('Could not fetch campaigns from backend, using local demo data:', err);
        applyLocalFallback();
      }
    };

    // apply local storage fallback (same as before)
    const applyLocalFallback = () => {
      const storedDomestic = JSON.parse(localStorage.getItem('domesticCampaigns'));
      const storedInternational = JSON.parse(localStorage.getItem('internationalCampaigns'));

      if (storedDomestic && storedDomestic.length > 0) {
        setDomesticCampaigns(storedDomestic);
      } else {
        // initial domestic campaigns (kept small for readability)
        const initialDomestic = [
          {
            _id: 'd1',
            title: 'Education for All',
            description: 'Support primary education in rural areas.',
            goal: 500000,
            urgency: 'Urgent',
            deadline: 'July 20, 2025',
            currency: 'PKR',
            beneficiaryInfo: `• Build classrooms\n• Provide school supplies\n• Hire teachers`,
          },
        ];
        setDomesticCampaigns(initialDomestic);
        localStorage.setItem('domesticCampaigns', JSON.stringify(initialDomestic));
      }

      if (storedInternational && storedInternational.length > 0) {
        setInternationalCampaigns(storedInternational);
      } else {
        const initialInternational = [
          {
            _id: 'i1',
            title: 'Earthquake Relief in Turkey',
            description: 'Help families rebuild homes after disaster.',
            goal: 40000,
            urgency: 'Emergency',
            deadline: 'July 25, 2025',
            currency: 'USD',
            beneficiaryInfo: `• Temporary shelters\n• Medical support\n• Food kits`,
          },
        ];
        setInternationalCampaigns(initialInternational);
        localStorage.setItem('internationalCampaigns', JSON.stringify(initialInternational));
      }
    };

    fetchApproved();
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
