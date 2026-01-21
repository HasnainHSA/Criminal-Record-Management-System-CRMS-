'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  const slides = [
    {
      image: '/images/slIders.jpg',
      title: 'Crime Record Management System',
      subtitle: 'Protecting Our Community'
    },
    {
      image: '/images/slIders.jpg',
      title: 'Advanced Police Technology',
      subtitle: 'Powered by MIPS Assembly'
    },
    {
      image: '/images/slIders.jpg',
      title: 'Secure & Efficient',
      subtitle: 'In-House Police Solution'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800;900&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
          scroll-behavior: smooth;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow-x: hidden;
          cursor: none;
        }
        
        /* Custom Cursor */
        .custom-cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid #dc2626;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transition: all 0.1s ease;
          transform: translate(-50%, -50%);
        }
        
        .custom-cursor-dot {
          position: fixed;
          width: 6px;
          height: 6px;
          background: #dc2626;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10001;
          transition: all 0.05s ease;
          transform: translate(-50%, -50%);
        }
        
        .custom-cursor.hover {
          width: 50px;
          height: 50px;
          background: rgba(220, 38, 38, 0.1);
          border-color: #dc2626;
        }
        
        a, button, .nav-link {
          cursor: none !important;
        }
      `}</style>
      <style jsx>{`
        /* Floating Navigation */
        .floating-nav {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          z-index: 1000;
          border-radius: 50px;
          padding: 15px 50px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          min-width: 1100px;
        }
        
        .floating-nav:hover {
          box-shadow: 0 15px 50px rgba(0,0,0,0.4);
        }
        
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        
        .nav-logo img {
          width: 120px;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(255,255,255,0.3));
        }
        
        .nav-links {
          display: flex;
          gap: 40px;
          align-items: center;
          flex: 1;
          justify-content: center;
        }
        
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          position: relative;
          white-space: nowrap;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: #dc2626;
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-link:hover {
          color: #dc2626;
        }
        
        .nav-cta {
          background: #dc2626;
          color: white;
          padding: 12px 30px;
          border-radius: 25px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .nav-cta:hover {
          background: #991b1b;
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
        }
        
        /* Hero Slider */
        .hero-slider {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }
        
        .slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
        
        .slide.active {
          opacity: 1;
        }
        
        .slide-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          animation: zoomIn 20s ease-in-out infinite;
        }
        
        @keyframes zoomIn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(220, 38, 38, 0.7) 100%);
        }
        
        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .floating-shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          animation: float 20s infinite ease-in-out;
        }
        
        .shape-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .shape-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 15%;
          animation-delay: 3s;
        }
        
        .shape-3 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 20%;
          animation-delay: 6s;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 20px;
          color: white;
        }
        
        .hero-subtitle {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #dc2626;
          margin-bottom: 20px;
          animation: fadeInDown 1s ease-out;
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-title {
          font-size: 72px;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 30px;
          animation: fadeInUp 1s ease-out 0.3s both;
          text-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-description {
          font-size: 20px;
          line-height: 1.8;
          max-width: 700px;
          margin-bottom: 50px;
          animation: fadeInUp 1s ease-out 0.6s both;
          color: rgba(255,255,255,0.9);
        }
        
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          background: #dc2626;
          color: white;
          padding: 22px 55px;
          font-size: 18px;
          font-weight: 700;
          text-decoration: none;
          border-radius: 50px;
          transition: all 0.4s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
          animation: fadeInUp 1s ease-out 0.9s both;
          box-shadow: 0 15px 40px rgba(220, 38, 38, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .hero-cta::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .hero-cta:hover::before {
          width: 400px;
          height: 400px;
        }
        
        .hero-cta:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(220, 38, 38, 0.6);
        }
        
        .slider-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          z-index: 3;
        }
        
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .dot.active {
          background: #dc2626;
          width: 40px;
          border-radius: 6px;
        }
        
        /* Walkthrough Section */
        .walkthrough-section {
          padding: 120px 20px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%);
          position: relative;
        }
        
        .walkthrough-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #dc2626, transparent);
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }
        
        .section-subtitle {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #dc2626;
          margin-bottom: 15px;
        }
        
        .section-title {
          font-size: 48px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.2;
          margin-bottom: 20px;
        }
        
        .section-description {
          font-size: 18px;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.8;
        }
        
        .walkthrough-steps {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 60px;
        }
        
        .step {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        
        .step:nth-child(even) {
          direction: rtl;
        }
        
        .step:nth-child(even) > * {
          direction: ltr;
        }
        
        .step-image {
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, #dc2626 0%, #1e3a8a 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 120px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        
        .step-image::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: rotate(45deg);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        .step-image:hover {
          transform: scale(1.05);
          box-shadow: 0 25px 70px rgba(0,0,0,0.2);
        }
        
        .step-content {
          padding: 20px;
        }
        
        .step-number {
          display: inline-block;
          width: 60px;
          height: 60px;
          background: #dc2626;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 25px;
          box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
        }
        
        .step-title {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 20px;
          line-height: 1.3;
        }
        
        .step-description {
          font-size: 17px;
          color: #64748b;
          line-height: 1.9;
          margin-bottom: 25px;
        }
        
        .step-features {
          list-style: none;
          padding: 0;
        }
        
        .step-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          font-size: 16px;
          color: #0f172a;
          font-weight: 600;
        }
        
        .step-features li::before {
          content: '✓';
          width: 28px;
          height: 28px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: 900;
        }
        
        /* About & Features Sections */
        .about-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 120px 20px;
          position: relative;
          overflow: hidden;
        }
        
        .about-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
          animation: pulse 8s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        
        .about-section .section-subtitle {
          color: #dc2626;
        }
        
        .about-section .section-title {
          color: white;
        }
        
        .about-section .section-description {
          color: #cbd5e1;
        }
        
        .about-content {
          max-width: 1200px;
          margin: 60px auto 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }
        
        .about-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 40px;
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s ease;
        }
        
        .about-card:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #dc2626;
          transform: translateY(-10px);
        }
        
        .about-card-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }
        
        .about-card h3 {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin-bottom: 15px;
        }
        
        .about-card p {
          font-size: 16px;
          color: #cbd5e1;
          line-height: 1.8;
        }
        
        .features-section {
          padding: 120px 20px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .feature-card {
          background: white;
          padding: 45px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          text-align: center;
          transition: all 0.4s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        .feature-card:hover::before {
          left: 100%;
        }
        
        .feature-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 60px rgba(220, 38, 38, 0.2);
          border-color: #dc2626;
        }
        
        .feature-icon {
          font-size: 72px;
          margin-bottom: 30px;
          display: inline-block;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        .feature-card:hover .feature-icon {
          animation: none;
          transform: scale(1.2) rotate(10deg);
        }
        
        .feature-card h3 {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 18px;
        }
        
        .feature-card p {
          font-size: 16px;
          color: #64748b;
          line-height: 1.8;
        }
        
        /* Contact Section */
        .contact-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          padding: 120px 20px;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 60px auto 0;
        }
        
        .contact-card {
          text-align: center;
          padding: 40px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .contact-card:hover {
          background: rgba(255,255,255,0.1);
          border-color: #dc2626;
          transform: translateY(-10px);
        }
        
        .contact-icon {
          width: 90px;
          height: 90px;
          background: #dc2626;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 30px;
          font-size: 42px;
          box-shadow: 0 15px 40px rgba(220, 38, 38, 0.4);
        }
        
        .contact-card h3 {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 18px;
        }
        
        .contact-card p {
          font-size: 17px;
          color: #cbd5e1;
          line-height: 1.8;
        }
        
        /* Modern Footer */
        .modern-footer {
          background: #000000;
          color: white;
          padding: 80px 20px 30px;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }
        
        .footer-column h3 {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 25px;
          color: white;
        }
        
        .footer-column p {
          font-size: 15px;
          color: #94a3b8;
          line-height: 1.8;
          margin-bottom: 20px;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }
        
        .footer-logo img {
          width: 50px;
          height: 50px;
        }
        
        .footer-logo-text {
          font-size: 24px;
          font-weight: 900;
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
        }
        
        .footer-links li {
          margin-bottom: 15px;
        }
        
        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 15px;
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .footer-links a:hover {
          color: #dc2626;
          transform: translateX(5px);
        }
        
        .footer-social {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }
        
        .social-icon {
          width: 45px;
          height: 45px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .social-icon:hover {
          background: #dc2626;
          transform: translateY(-5px);
        }
        
        .footer-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 40px 0;
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #64748b;
        }
        
        .footer-bottom-links {
          display: flex;
          gap: 30px;
        }
        
        .footer-bottom-links a {
          color: #64748b;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .footer-bottom-links a:hover {
          color: #dc2626;
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
          .floating-nav {
            min-width: 950px;
          }
        }
        
        @media (max-width: 1024px) {
          .floating-nav {
            top: 10px;
            padding: 12px 30px;
            min-width: 800px;
          }
          
          .nav-container {
            gap: 30px;
          }
          
          .nav-logo img {
            width: 100px;
          }
          
          .nav-links {
            gap: 25px;
          }
          
          .nav-link {
            font-size: 13px;
          }
          
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }
        
        @media (max-width: 768px) {
          .floating-nav {
            width: 90%;
            padding: 15px 20px;
            min-width: auto;
          }
          
          .nav-container {
            gap: 15px;
          }
          
          .nav-logo img {
            width: 80px;
          }
          
          .nav-links {
            display: none;
          }
          
          .hero-title {
            font-size: 42px;
          }
          
          .step {
            grid-template-columns: 1fr;
          }
          
          .step:nth-child(even) {
            direction: ltr;
          }
          
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>
      
      {/* Custom Cursor */}
      <div 
        className="custom-cursor" 
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      <div 
        className="custom-cursor-dot" 
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      
      {/* Floating Navigation */}
      <nav className="floating-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/images/logo.png" alt="Police Logo" onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'} />
          </div>
          <div className="nav-links">
            <span className="nav-link" onClick={() => scrollToSection('home')}>Home</span>
            <span className="nav-link" onClick={() => scrollToSection('about')}>About</span>
            <span className="nav-link" onClick={() => scrollToSection('walkthrough')}>How It Works</span>
            <span className="nav-link" onClick={() => scrollToSection('features')}>Features</span>
            <span className="nav-link" onClick={() => scrollToSection('contact')}>Contact</span>
          </div>
          <a href="/login" className="nav-cta">Launch System</a>
        </div>
      </nav>

      {/* Hero Slider */}
      <section id="home" className="hero-slider">
        {slides.map((slide, index) => (
          <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
            <div className="slide-bg" style={{ backgroundImage: `url(${slide.image})` }} />
            <div className="slide-overlay" />
            <div className="animated-bg">
              <div className="floating-shape shape-1" />
              <div className="floating-shape shape-2" />
              <div className="floating-shape shape-3" />
            </div>
            <div className="hero-content">
              <div className="hero-subtitle">🚨 IN-HOUSE POLICE MANAGEMENT SYSTEM</div>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-description">
                Advanced internal platform for law enforcement professionals. Secure FIR management, 
                criminal database, and real-time case tracking powered by MIPS technology.
              </p>
              <a href="/login" className="hero-cta">
                <span>🔐</span>
                <span>Access System</span>
              </a>
            </div>
          </div>
        ))}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Walkthrough Section */}
      <section id="walkthrough" className="walkthrough-section">
        <div className="section-header">
          <div className="section-subtitle">📋 HOW IT WORKS</div>
          <h2 className="section-title">Simple Steps to Get Started</h2>
          <p className="section-description">
            Our system is designed for ease of use. Follow these simple steps to manage crime records efficiently.
          </p>
        </div>
        
        <div className="walkthrough-steps">
          <div className="step">
            <div className="step-image">
              <span>🔐</span>
            </div>
            <div className="step-content">
              <div className="step-number">1</div>
              <h3 className="step-title">Officer Authentication</h3>
              <p className="step-description">
                Secure login system ensures only authorized police officers can access the system. 
                Each officer has unique credentials for accountability.
              </p>
              <ul className="step-features">
                <li>Secure officer ID and password</li>
                <li>Role-based access control</li>
                <li>Activity logging and tracking</li>
              </ul>
            </div>
          </div>

          <div className="step">
            <div className="step-image">
              <span>📝</span>
            </div>
            <div className="step-content">
              <div className="step-number">2</div>
              <h3 className="step-title">File FIR Reports</h3>
              <p className="step-description">
                Quick and efficient FIR registration with real-time validation. Enter criminal details, 
                crime type, location, and date with instant MIPS backend processing.
              </p>
              <ul className="step-features">
                <li>Instant data validation</li>
                <li>Automatic FIR number generation</li>
                <li>Secure data storage</li>
              </ul>
            </div>
          </div>

          <div className="step">
            <div className="step-image">
              <span>🔍</span>
            </div>
            <div className="step-content">
              <div className="step-number">3</div>
              <h3 className="step-title">Search & Track</h3>
              <p className="step-description">
                Advanced search capabilities allow officers to quickly locate criminal records, 
                view case histories, and track ongoing investigations.
              </p>
              <ul className="step-features">
                <li>Fast criminal database search</li>
                <li>Comprehensive case details</li>
                <li>Real-time updates</li>
              </ul>
            </div>
          </div>

          <div className="step">
            <div className="step-image">
              <span>📊</span>
            </div>
            <div className="step-content">
              <div className="step-number">4</div>
              <h3 className="step-title">View Dashboard</h3>
              <p className="step-description">
                Comprehensive dashboard displays all FIR records with detailed information. 
                Monitor cases, generate reports, and analyze crime patterns.
              </p>
              <ul className="step-features">
                <li>All records in one place</li>
                <li>Detailed case information</li>
                <li>Export and reporting tools</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-header">
          <div className="section-subtitle">🚨 ABOUT THE SYSTEM</div>
          <h2 className="section-title">What is CRMS?</h2>
          <p className="section-description">
            Crime Record Management System (CRMS) is an in-house organizational platform designed 
            exclusively for police department operations. Built with security and efficiency in mind.
          </p>
        </div>
        
        <div className="about-content">
          <div className="about-card">
            <span className="about-card-icon">🛡️</span>
            <h3>Secure & Reliable</h3>
            <p>
              Military-grade security with MIPS assembly backend ensures your data is protected 
              with the highest level of encryption and access control.
            </p>
          </div>
          
          <div className="about-card">
            <span className="about-card-icon">⚡</span>
            <h3>Fast & Efficient</h3>
            <p>
              Lightning-fast data processing and retrieval. Access criminal records, file FIRs, 
              and generate reports in seconds, not minutes.
            </p>
          </div>
          
          <div className="about-card">
            <span className="about-card-icon">👮</span>
            <h3>Officer-Focused</h3>
            <p>
              Designed by law enforcement professionals for law enforcement. Intuitive interface 
              that requires minimal training and maximizes productivity.
            </p>
          </div>
          
          <div className="about-card">
            <span className="about-card-icon">📊</span>
            <h3>Comprehensive Analytics</h3>
            <p>
              Real-time dashboards and detailed reports help you track crime patterns, 
              monitor case progress, and make data-driven decisions.
            </p>
          </div>
          
          <div className="about-card">
            <span className="about-card-icon">🔄</span>
            <h3>Real-Time Sync</h3>
            <p>
              All data is synchronized in real-time across all department units. 
              Updates are instant and accessible to authorized personnel immediately.
            </p>
          </div>
          
          <div className="about-card">
            <span className="about-card-icon">💻</span>
            <h3>Modern Technology</h3>
            <p>
              Built with cutting-edge technology stack including Next.js frontend, 
              Python Flask backend, and MIPS assembly for critical operations.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <div className="section-subtitle">🔍 SYSTEM FEATURES</div>
          <h2 className="section-title">Powerful Tools for Law Enforcement</h2>
          <p className="section-description">
            Comprehensive features designed specifically for police department operations and case management.
          </p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>FIR Registration</h3>
            <p>
              Quick and secure First Information Report registration with validation and instant storage.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Criminal Search</h3>
            <p>
              Advanced search capabilities to locate criminal records and case histories instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Case Dashboard</h3>
            <p>
              Comprehensive dashboard with real-time statistics and detailed case reporting.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👮</div>
            <h3>Officer Management</h3>
            <p>
              Secure officer registration and authentication with role-based access control.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Data Security</h3>
            <p>
              Military-grade encryption with MIPS assembly backend for maximum security.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Processing</h3>
            <p>
              Instant data processing and synchronization across all department units.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <div className="section-subtitle" style={{color: '#dc2626'}}>📞 CONTACT INFORMATION</div>
          <h2 className="section-title" style={{color: 'white'}}>Get In Touch</h2>
          <p className="section-description" style={{color: '#cbd5e1'}}>
            For system access, technical support, or inquiries, contact the IT department.
          </p>
        </div>
        
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">🚨</div>
            <h3>Emergency Hotline</h3>
            <p>15<br/>Available 24/7</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3>Police Helpline</h3>
            <p>021-99000000<br/>24/7 Support</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">💻</div>
            <h3>IT Support</h3>
            <p>For system access and<br/>technical assistance</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">🏢</div>
            <h3>Headquarters</h3>
            <p>Police Department<br/>Main Office</p>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <img src="/images/logo.png" alt="Police Logo" onError={(e) => e.target.style.display = 'none'} />
                <span className="footer-logo-text">POLICE CRMS</span>
              </div>
              <p>
                Advanced Crime Record Management System designed exclusively for police department 
                operations. Secure, efficient, and powered by MIPS technology.
              </p>
              <div className="footer-social">
                <a href="#" className="social-icon">📘</a>
                <a href="#" className="social-icon">🐦</a>
                <a href="#" className="social-icon">📷</a>
                <a href="#" className="social-icon">💼</a>
              </div>
            </div>

            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
                <li><a href="#walkthrough" onClick={(e) => { e.preventDefault(); scrollToSection('walkthrough'); }}>How It Works</a></li>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>System Access</h3>
              <ul className="footer-links">
                <li><a href="/login">Officer Login</a></li>
                <li><a href="/register-officer">Register Officer</a></li>
                <li><a href="/add-fir">File FIR</a></li>
                <li><a href="/search-criminal">Search Criminal</a></li>
                <li><a href="/view-firs">View Dashboard</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Contact Info</h3>
              <ul className="footer-links">
                <li><a href="tel:15">Emergency: 15</a></li>
                <li><a href="tel:021-99000000">Helpline: 021-99000000</a></li>
                <li><a href="mailto:support@police.gov">support@police.gov</a></li>
                <li><a href="#">IT Department</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p>© 2025 Police Department - Crime Record Management System. All Rights Reserved by <strong style={{color: '#dc2626'}}>Hasnain Saleem</strong> & <strong style={{color: '#dc2626'}}>Shahood Khan</strong></p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Internal Use Only</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
