import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Routes/Main';
import AdminRoute from './Routes/AdminRoute';
import UserRoute from './Routes/UserRoute';
import PrivateRoute from './Routes/PrivateRoute';
import { useSelector, useDispatch } from 'react-redux';
import { setUser,unsetUser } from './Store/userSlice';
import { auth, firestore } from './Firebase/Config';
import { setLoading } from './Store/loadingSlice';
import Loading from './Components/Loading';

function App() {
  const dispatch = useDispatch();
  const userStore = useSelector((state: any) => state.user);
  const isLoading = useSelector((state: any) => state.loading.isLoading);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        firestore.collection('users').where('id', '==', user?.uid)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              // setting current user data state
              const userData = doc.data();
              console.log(userData)
              dispatch(setUser({ id: userData.id, type: userData.type, name: userData.name }))
            });
          })
          .finally(() => {
            dispatch(setLoading(false));
          })
      } else {
        // User is signed out
        dispatch(setLoading(false));
        dispatch(unsetUser())
      }
    });
  }, [dispatch]);
console.log(userStore);
  return (
    <div className="App h-100">
      {
        isLoading ? (
          <Loading />
        ) : (
          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/hr/*" element={<PrivateRoute isAuthenticated={userStore.isAuthenticated} isValidUsertype={userStore.type == 'admin'}><AdminRoute /></PrivateRoute>} />
              <Route path="/user/*" element={<PrivateRoute isAuthenticated={userStore.isAuthenticated} isValidUsertype={userStore.type == 'user'} children={<UserRoute />} />} />
            </Routes>
          </Router>
        )}
    </div>
  );
}

export default App;
