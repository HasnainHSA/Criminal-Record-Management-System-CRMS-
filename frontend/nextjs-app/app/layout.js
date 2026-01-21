'use client'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  return (
    <html lang="en">
      <head>
        <title>Police CRMS - Crime Record Management System</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');
          
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
            font-family: 'Poppins', sans-serif;
          }
          
          body { 
            background: #ffffff;
            color: #0f172a;
          }
          
          /* Header Styles */
          .header {
            background: #0f172a;
            color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          
          .header-top {
            background: #dc2626;
            padding: 12px 0;
            font-size: 13px;
            font-weight: 600;
          }
          
          .header-top-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .header-main {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .logo-img {
            width: 50px;
            height: 50px;
            object-fit: contain;
          }
          
          .logo-text h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
          }
          
          .logo-text p {
            font-size: 12px;
            font-weight: 400;
            opacity: 0.8;
          }
          
          /* Navigation */
          .nav {
            background: white;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .nav-links {
            display: flex;
            gap: 0;
          }
          
          .nav-links a {
            color: #0f172a;
            text-decoration: none;
            padding: 20px 25px;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            border-bottom: 3px solid transparent;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .nav-links a:hover {
            color: #dc2626;
            border-bottom-color: #dc2626;
          }
          
          .nav-links a.active {
            color: #dc2626;
            border-bottom-color: #dc2626;
          }
          
          /* Container */
          .container {
            margin: 0;
            padding: 0;
          }
          
          /* Card Styles */
          .card {
            background: white;
            padding: 60px 40px;
            max-width: 800px;
            margin: 60px auto;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          
          .card h2 {
            font-size: 36px;
            margin-bottom: 40px;
            color: #0f172a;
            font-weight: 800;
            text-align: center;
          }
          
          /* Form Styles */
          .form-group {
            margin-bottom: 25px;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #0f172a;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 14px 18px;
            border: 2px solid #e2e8f0;
            border-radius: 4px;
            font-size: 15px;
            transition: all 0.3s ease;
            font-family: inherit;
            background: #f8fafc;
          }
          
          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #dc2626;
            background: white;
          }
          
          /* Button Styles */
          .btn {
            background: #dc2626;
            color: white;
            padding: 16px 40px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 700;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            width: 100%;
            margin-top: 10px;
          }
          
          .btn:hover {
            background: #991b1b;
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
          }
          
          .btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
          }
          
          .btn-secondary {
            background: #1e3a8a;
          }
          
          .btn-secondary:hover {
            background: #1e40af;
          }
          
          /* Alert Styles */
          .alert {
            padding: 18px 24px;
            border-radius: 4px;
            margin-bottom: 30px;
            font-weight: 600;
            font-size: 15px;
          }
          
          .alert-success {
            background: #d1fae5;
            color: #065f46;
            border-left: 4px solid #10b981;
          }
          
          .alert-error {
            background: #fee2e2;
            color: #991b1b;
            border-left: 4px solid #dc2626;
          }
          
          /* Record Card Styles */
          .records-container {
            background: #f8fafc;
            padding: 40px;
            border-radius: 8px;
            margin-top: 40px;
          }
          
          .record-card {
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #dc2626;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          
          .record-card:hover {
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            transform: translateY(-4px);
          }
          
          .record-card h3 {
            color: #dc2626;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 700;
          }
          
          .record-field {
            margin-bottom: 12px;
            color: #64748b;
            font-size: 15px;
            line-height: 1.6;
          }
          
          .record-field strong {
            color: #0f172a;
            margin-right: 10px;
            min-width: 110px;
            display: inline-block;
            font-weight: 700;
          }
          
          /* Footer */
          .footer {
            background: #0f172a;
            color: white;
            padding: 50px 20px 30px;
            margin-top: 0;
          }
          
          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
          }
          
          .footer h3 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 15px;
          }
          
          .footer p {
            margin: 10px 0;
            font-size: 14px;
            color: #cbd5e1;
            line-height: 1.8;
          }
          
          .footer-divider {
            height: 1px;
            background: rgba(255,255,255,0.1);
            margin: 30px 0;
          }
          
          .footer-bottom {
            font-size: 13px;
            color: #94a3b8;
          }
          
          /* Responsive */
          @media (max-width: 768px) {
            .header-main {
              flex-direction: column;
              text-align: center;
              gap: 15px;
            }
            
            .nav-links {
              flex-direction: column;
            }
            
            .nav-links a {
              width: 100%;
              text-align: center;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .card {
              padding: 40px 25px;
              margin: 30px 20px;
            }
          }
        `}</style>
      </head>
      <body>
        {pathname === '/' || pathname === '/login' || pathname?.startsWith('/dashboard') ? (
          // Landing page, login page, and dashboard - no header/nav/footer
          <>{children}</>
        ) : (
          // App pages - with header/nav/footer
          <>
            <div className="header">
              <div className="header-top">
                <div className="header-top-content">
                  <span>🚨 EMERGENCY: 15</span>
                  <span>📞 HELPLINE: 021-99000000</span>
                </div>
              </div>
              <div className="header-main">
                <div className="logo-container">
                  <img 
                    src="/images/logo.png" 
                    alt="Police Logo" 
                    className="logo-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="logo" style={{display: 'none', width: '50px', height: '50px', background: 'white', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#dc2626'}}>
                    🚔
                  </div>
                  <div className="logo-text">
                    <h1>POLICE CRMS</h1>
                    <p>Crime Record Management System</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="nav">
              <div className="nav-container">
                <div className="nav-links">
                  <a href="/" className={pathname === '/' ? 'active' : ''}>🏠 Home</a>
                  <a href="/register-officer" className={pathname === '/register-officer' ? 'active' : ''}>👮 Register Officer</a>
                  <a href="/login" className={pathname === '/login' ? 'active' : ''}>🔐 Login</a>
                  <a href="/add-fir" className={pathname === '/add-fir' ? 'active' : ''}>📝 File FIR</a>
                  <a href="/search-criminal" className={pathname === '/search-criminal' ? 'active' : ''}>🔍 Search</a>
                  <a href="/view-firs" className={pathname === '/view-firs' ? 'active' : ''}>📊 Dashboard</a>
                </div>
              </div>
            </div>
            
            <div className="container">
              {children}
            </div>
            
            <div className="footer">
              <div className="footer-content">
                <h3>🚔 POLICE CRIME RECORD MANAGEMENT SYSTEM</h3>
                <p>Protecting & Serving Our Community with Advanced Technology</p>
                <p>🚨 Emergency: 15 | 📞 Helpline: 021-99000000 | Available 24/7</p>
                <div className="footer-divider"></div>
                <div className="footer-bottom">
                  © 2025 Police Department. All Rights Reserved.
                </div>
              </div>
            </div>
          </>
        )}
      </body>
    </html>
  )
}
