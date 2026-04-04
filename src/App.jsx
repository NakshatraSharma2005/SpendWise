import React from "react";
import Navbar from "./Pages/LandingPage/Navbar";
import Hero from "./Pages/LandingPage/Hero";
import Features from "./Pages/LandingPage/Features";
import HowItWorks from "./Pages/LandingPage/HowItWorks";
import Personalization from "./Pages/LandingPage/Personalization";
import AIInsights from "./Pages/LandingPage/AIInsights";
import Testimonials from "./Pages/LandingPage/Testimonials";
import CTA from "./Pages/LandingPage/CTA";
import Footer from "./Pages/LandingPage/Footer";
import AuthPage from "./Pages/Authentication/AuthPage";
import Onboarding from "./Components/Onboarding";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { BrowserRouter , Routes, Route } from "react-router-dom";

function LandingPage() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <Personalization />
                <AIInsights />
                <Testimonials />
                <CTA />
            </main>
            <Footer />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#0f172a] font-sans selection:bg-emerald-500/30">
                <Routes>
                    {/* Landing */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Auth */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />
                    
                    {/* Onboarding */}
                    <Route path="/onboarding" element={<Onboarding />} />
                    
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;