import React, {Suspense, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Expenses from './components/expenses/Expenses';
import TaskManager from './components/task-manager/TaskManager';
import LeadGeneration from './components/lead-generation/LeadGeneration';
import Calendar from './components/calendar/Calendar';

import Spinner from './shared/Spinner';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/sign-up/SignUp';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import SettingsPanel from './shared/SettingsPanel';
import Footer from './shared/Footer';
import OTP from './pages/auth/OTP';

const AppRoutes = ()=> {
  const [isFullPageLayout, setIsFullPageLayout] = useState(false) 
  let navbarComponent = !isFullPageLayout ? <Navbar/> : '';
  let sidebarComponent = !isFullPageLayout ? <Sidebar/> : '';
  //let SettingsPanelComponent = !isFullPageLayout ? <SettingsPanel/> : '';
  let footerComponent = !isFullPageLayout ? <Footer/> : '';



  
  useEffect(() => {
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ['/auth/login', '/auth/sign-up', '/otp'];
    for ( let i = 0; i < fullPageLayoutRoutes.length; i++ ) {
      if (window.location.pathname === fullPageLayoutRoutes[i]) {
        setIsFullPageLayout(true)
        document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
        break;
      } else {
        setIsFullPageLayout(false)
        document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
      }
    }

  },[])


    return (
      <div className="container-scroller">
          { navbarComponent }
          <div className="container-fluid page-body-wrapper">
            { sidebarComponent }
            <div className="main-panel">
              <div className="content-wrapper">
                <Suspense fallback={<Spinner/>}>
                  <Routes>
                    <Route exact path="/" element={<Navigate replace to="/dashboard" />} />
                    <Route exact path='/dashboard' element={<Dashboard />} />
                    <Route exact path='/expenses' element={<Expenses />} />
                    <Route exact path='/task-manager' element={<TaskManager />} />
                    {/* <Route path='task-manager/add:{slug}' element={<AddTask />} /> */}
                    <Route exact path='/lead-generation' element={<LeadGeneration />} />
                    <Route exact path='/calendar' element={<Calendar />} />
                    <Route exact path='/auth/login' element={<Login />} />
                    <Route exact path='/auth/sign-up' element={<SignUp />} />
                    <Route exact path='/otp' element={<OTP />} />
                    <Route exact path='*' element='Page does not exits' />
                  </Routes>
                </Suspense>
                {/* { SettingsPanelComponent } */}
              </div>
              { footerComponent }
            </div>
          </div>
        </div>
    );
}

export default AppRoutes;