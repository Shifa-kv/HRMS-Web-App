import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Routes/Main';
import AdminRoute from './Routes/AdminRoute';
import UserRoute from './Routes/UserRoute';
import PrivateRoute from './Routes/PrivateRoute';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, unsetUser } from './Store/userSlice';
import { auth, firestore } from './Firebase/Config';
import { setLoading } from './Store/loadingSlice';
import Loading from './Components/Loading';
import { setDepartment } from './Store/departmentSlice';

function App() {
  const dispatch = useDispatch();
  const userStore = useSelector((state: any) => state.user);
  const isLoading = useSelector((state: any) => state.loading.isLoading);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        firestore.collection('users').where('id', '==', user?.uid)
          .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
              // setting current user data state
              let userData = doc.data();
              if (userData?.manager) {
                firestore.collection('users').doc(userData?.manager).get()
                  .then((doc) => {
                    const managerName = doc.data()?.name;
                    userData = {...userData,managerName}
                    dispatch(setUser({ ...userData, id: doc.id, managerName }))
                  })
              }
              else{
                dispatch(setUser({ ...userData, id: doc.id }))
              }
              // setting departments state
              firestore.collection('departments').onSnapshot((snapshot) => {
                const deptData = snapshot.docs.map((dept) => {
                  return {
                    title: dept.data().department_name,
                    manager: dept.data().department_head,
                    id: dept.id
                  }
                })
                dispatch(setDepartment(deptData))
              });
            });
            dispatch(setLoading(false));
          }, (error) => {
            console.error('Error fetching user data:', error);
            dispatch(setLoading(false));
          });
      } else {
        // User is signed out
        dispatch(setLoading(false));
        dispatch(unsetUser())
      }
    });
  }, [dispatch]);
  // console.log(userStore);

  return (
    <div className="App h-100">
      {
        isLoading ? (
          <Loading />
        ) : (
          <Router basename={process.env.PUBLIC_URL}>
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
