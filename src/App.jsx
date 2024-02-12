import React, { useState } from 'react';
import UserAuthComponent from './User/UserAuth';
import { BrowserRouter, Routes, Route, redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Dashboard from './Dashboards/Main';
export function App() {
  const [id, setId] = useState('');
  React.useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          const uid = user?.uid;
          setId(uid);
          redirect('/dashboard');
          console.log('uid', uid);
        } else {
          redirect('/');
          console.log('user is logged out');
        }
      },
      []
    );
  });
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<UserAuthComponent />} />
          <Route exact path="/dashboard" element={<Dashboard uid={id} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
