import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/navbar";
import Footer from "../Footer/footer.jsx";

const posts = [
  {
    id: 1,
    title: "The Power of Small Donations in a Global Movement",
    date: "May 18, 2025",
    excerpt:
      "Even the smallest contributions can drive massive change. Learn how micro-donations create ripple effects in international fundraising.",
    description: `Small donations can have a significant impact on global movements when combined with the collective effort of many individuals. Even seemingly insignificant contributions can add up to substantial resources for addressing various global challenges. This power stems from the fact that small donations democratize giving, allowing people from all walks of life to participate in positive change.`,
    image: "/blog1.jpg",
  },
  {
    id: 2,
    title: "Storytelling That Moves Hearts: Sharing Your Cause Globally",
    date: "April 20, 2025",
    excerpt:
      "Discover how emotionally engaging stories can break borders and resonate with supporters across different cultures and countries.",
    description: `Storytelling is a powerful tool for connecting with people on an emotional level and inspiring them to support a cause, both locally and globally. By focusing on individual stories, showcasing the impact of your work, and using visuals, you can create compelling narratives that resonate with your audience and motivate them to take action.`,
    image: "/blog2.jpg",
  },
  {
    id: 3,
    title: "Digital Fundraising Trends to Watch in 2025",
    date: "March 15, 2025",
    excerpt:
      "Stay ahead with the latest innovations in online fundraising — from crypto donations to AI-powered donor engagement.",
    description: `A key digital fundraising trend to watch in 2025 is the increasing use of AI-powered personalization and automation in fundraising campaigns. This involves leveraging artificial intelligence to tailor donation appeals, optimize fundraising strategies, and improve the overall donor experience. Nonprofits will increasingly use AI to personalize communication, target specific donor segments, and automate repetitive tasks, leading to more efficient and effective fundraising efforts.`,
    image: "/blog3.jpg",
  },
  {
    id: 4,
    title: "From Local to Global: Scaling Your Charity Campaign",
    date: "February 10, 2025",
    excerpt:
      "Practical tips on taking a local initiative and expanding it for international impact, while maintaining authenticity.",
    description: `To scale a charity campaign from a local Pakistan focus to a global one, focus on leveraging digital platforms for storytelling, fundraising, and impact measurement while ensuring compliance and localization. This involves building a strong online presence, crafting compelling narratives, and utilizing tools that enhance transparency and trackability of donations.`,
    image: "/blog4.jpg",
  },
  {
    id: 5,
  title: "Fundraising Challenges in Developing Countries — and How to Overcome Them",
  date: "January 5, 2025",
  excerpt:
    "Explore common obstacles like tech access, trust issues, and financial infrastructure — with real strategies for progress.",
  description: `Fundraising in developing countries presents unique hurdles such as limited access to technology, unstable communication networks, and bureaucratic roadblocks. Overcoming these challenges requires innovative strategies, including leveraging local networks, adopting mobile payment solutions, and prioritizing transparency and community engagement. countries like Pakistan face distinct fundraising challenges. Limited internet access...`,
  image: "/blog5.jpg",
  },
  {
    id: 6,
    title: "Building Partnerships with NGOs and Influencers for Global Reach",
    date: "December 1, 2024",
    image: "/blog6.jpg",
    excerpt:
      "Collaborate for success. See how partnering with organizations and social voices can amplify your campaign's visibility and funding.",
    description: `Collaboration is a cornerstone of effective fundraising. In Pakistan, partnerships between Building partnerships with NGOs and influencers can significantly enhance global reach by leveraging their unique strengths and networks. NGOs offer credibility, on-the-ground experience, and access to specific communities, while influencers can amplify messages to wider audiences and drive engagement....`,
  },
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const openModal = (post) => setSelectedPost(post);
  const closeModal = () => setSelectedPost(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 py-10 px-4 sm:px-8 lg:px-16">
        <h1 className="text-4xl font-bold mb-4 text-center text-green-700">.</h1>
        <p className="text-center mb-12 text-black max-w-2xl mx-auto">
          Welcome to our blog! Explore expert tips, inspiring stories, and useful
          guides to help you make a bigger impact in global fundraising.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                  Blog Image {post.id}
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  {post.title}
                </h2>
                <time className="text-sm text-gray-500 block mb-2">{post.date}</time>
                <p className="text-gray-700 text-sm">{post.excerpt}</p>
                <button
                  onClick={() => openModal(post)}
                  className="text-blue-600 hover:underline text-sm font-medium mt-3 inline-block"
                >
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>

        {selectedPost && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg overflow-y-auto max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-3 text-gray-500 text-3xl hover:text-red-600"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-green-700 mb-4">{selectedPost.title}</h2>
              <time className="text-sm text-gray-500 block mb-6">{selectedPost.date}</time>
              <p className="text-gray-700 whitespace-pre-line">{selectedPost.description}</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Blog;
