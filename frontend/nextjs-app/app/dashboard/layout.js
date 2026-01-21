'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Get user from localStorage (set during login)
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/login')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  const adminMenuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '👮', label: 'Manage Officers', path: '/dashboard/officers' },
    { icon: '📝', label: 'Register FIR', path: '/dashboard/register-fir' },
    { icon: '🔍', label: 'Search Criminal', path: '/dashboard/search' },
    { icon: '📋', label: 'View All FIRs', path: '/dashboard/firs' },
    { icon: '⚖️', label: 'Case Status', path: '/dashboard/cases' },
    { icon: '👤', label: 'Assign Case', path: '/dashboard/assign' },
    { icon: '📈', label: 'Analytics & Reports', path: '/dashboard/analytics' },
  ]

  const officerMenuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📌', label: 'My Assigned Cases', path: '/dashboard/my-cases' },
    { icon: '📝', label: 'Register FIR', path: '/dashboard/register-fir' },
    { icon: '🔍', label: 'Search Criminal', path: '/dashboard/search' },
    { icon: '📋', label: 'View All FIRs', path: '/dashboard/firs' },
    { icon: '⚖️', label: 'Case Status', path: '/dashboard/cases' },
    { icon: '📈', label: 'Analytics & Reports', path: '/dashboard/analytics' },
  ]

  const menuItems = user?.role === 'admin' ? adminMenuItems : officerMenuItems

  if (!user) return null

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        
        body {
          background: #f5f6fa;
          overflow-x: hidden;
        }
      `}</style>
      <style jsx>{`
          .dashboard-container {
            display: flex;
            min-height: 100vh;
          }
          
          /* Sidebar */
          .sidebar {
            width: ${sidebarOpen ? '280px' : '80px'};
            background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #dc2626 100%);
            color: white;
            transition: all 0.3s ease;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 4px 0 20px rgba(0,0,0,0.15);
          }
          
          .sidebar::-webkit-scrollbar {
            width: 6px;
          }
          
          .sidebar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
          }
          
          .sidebar-header {
            padding: 25px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.15);
          }
          
          .sidebar-logo {
            width: 50px;
            height: 50px;
            background: white;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            padding: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          
          .sidebar-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .sidebar-title {
            font-size: 20px;
            font-weight: 800;
            opacity: ${sidebarOpen ? '1' : '0'};
            transition: opacity 0.3s ease;
          }
          
          .sidebar-menu {
            padding: 20px 0;
          }
          
          .menu-item {
            padding: 14px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            position: relative;
            margin: 4px 12px;
            border-radius: 12px;
          }
          
          .menu-item:hover {
            background: rgba(255,255,255,0.1);
            color: white;
          }
          
          .menu-item.active {
            background: linear-gradient(135deg, #dc2626 0%, #1e3a8a 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
          }
          
          .menu-item.active::before {
            content: '';
            position: absolute;
            left: -12px;
            width: 4px;
            height: 100%;
            background: #dc2626;
            border-radius: 0 4px 4px 0;
          }
          
          .menu-icon {
            font-size: 22px;
            flex-shrink: 0;
          }
          
          .menu-label {
            font-size: 15px;
            font-weight: 600;
            opacity: ${sidebarOpen ? '1' : '0'};
            transition: opacity 0.3s ease;
            white-space: nowrap;
          }
          
          .sidebar-profile {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: rgba(0,0,0,0.2);
            border-top: 1px solid rgba(255,255,255,0.1);
          }
          
          .profile-info {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
          }
          
          .profile-avatar {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #dc2626 0%, #1e3a8a 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 800;
            flex-shrink: 0;
            border: 3px solid rgba(255,255,255,0.3);
          }
          
          .profile-details {
            opacity: ${sidebarOpen ? '1' : '0'};
            transition: opacity 0.3s ease;
          }
          
          .profile-name {
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 3px;
          }
          
          .profile-role {
            font-size: 12px;
            color: rgba(255,255,255,0.6);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .logout-btn {
            width: 100%;
            padding: 12px;
            background: rgba(220, 38, 38, 0.25);
            border: 1px solid rgba(220, 38, 38, 0.4);
            color: #fca5a5;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .logout-btn:hover {
            background: rgba(220, 38, 38, 0.4);
            border-color: rgba(220, 38, 38, 0.6);
            color: white;
          }
          
          /* Main Content */
          .main-content {
            flex: 1;
            margin-left: ${sidebarOpen ? '280px' : '80px'};
            transition: margin-left 0.3s ease;
            min-height: 100vh;
          }
          
          .top-bar {
            background: white;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 3px solid transparent;
            border-image: linear-gradient(90deg, #1e3a8a 0%, #dc2626 100%);
            border-image-slice: 1;
          }
          
          .top-bar-left {
            display: flex;
            align-items: center;
            gap: 20px;
          }
          
          .toggle-btn {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.3s ease;
            color: white;
          }
          
          .toggle-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(30, 58, 138, 0.4);
          }
          
          .search-bar {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #f5f6fa;
            padding: 12px 20px;
            border-radius: 12px;
            width: 400px;
            border: 2px solid transparent;
            transition: all 0.3s ease;
          }
          
          .search-bar:focus-within {
            border-color: #1e3a8a;
            box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1);
          }
          
          .search-bar input {
            border: none;
            background: none;
            outline: none;
            font-size: 14px;
            width: 100%;
            color: #2d3561;
          }
          
          .search-bar input::placeholder {
            color: #a0a4b8;
          }
          
          .top-bar-right {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .notification-btn {
            width: 40px;
            height: 40px;
            background: #f5f6fa;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            position: relative;
            transition: all 0.3s ease;
          }
          
          .notification-btn:hover {
            background: linear-gradient(135deg, #1e3a8a15 0%, #dc262615 100%);
            transform: translateY(-2px);
          }
          
          .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            background: #dc2626;
            border-radius: 50%;
            font-size: 11px;
            font-weight: 700;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .content-area {
            padding: 30px;
          }
          
          @media (max-width: 768px) {
            .sidebar {
              width: ${sidebarOpen ? '280px' : '0'};
              transform: translateX(${sidebarOpen ? '0' : '-100%'});
            }
            
            .main-content {
              margin-left: 0;
            }
            
            .search-bar {
              width: 200px;
            }
          }
        `}</style>

        <div className="dashboard-container">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <img src="/images/logo.png" alt="Police Logo" onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '🚔'
                }} />
              </div>
              {sidebarOpen && <div className="sidebar-title">POLICE CRMS</div>}
            </div>

            <nav className="sidebar-menu">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.path}
                  className={`menu-item ${pathname === item.path ? 'active' : ''}`}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {sidebarOpen && <span className="menu-label">{item.label}</span>}
                </a>
              ))}
            </nav>

            <div className="sidebar-profile">
              <div className="profile-info">
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                {sidebarOpen && (
                  <div className="profile-details">
                    <div className="profile-name">{user?.name || 'Admin'}</div>
                    <div className="profile-role">{user?.role || 'Administrator'}</div>
                  </div>
                )}
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <span>🚪</span>
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="top-bar">
              <div className="top-bar-left">
                <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  ☰
                </button>
                <div className="search-bar">
                  <span>🔍</span>
                  <input type="text" placeholder="Type keywords to search..." />
                </div>
              </div>
              <div className="top-bar-right">
                <button className="notification-btn">
                  🔔
                  <span className="notification-badge">3</span>
                </button>
                <button className="notification-btn">⚙️</button>
              </div>
            </div>

            <div className="content-area">
              {children}
            </div>
          </main>
        </div>
      </>
  )
}
