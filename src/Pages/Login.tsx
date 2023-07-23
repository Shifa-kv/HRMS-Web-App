import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setUser } from '../Store/userSlice';
import { firestore, auth } from '../Firebase/Config';
import image from '../Assets/images/startbg.jpg';
import { useNavigate } from 'react-router-dom'
import Notice from '../Components/Notice';
import { delNotice, setNotice } from '../Store/noticeSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [ValidationErrors, setValidationErrors] = useState<{ [key: string]: string | boolean }>({});
  const navigate = useNavigate();

  // Login form submit event

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    if (email && password && !ValidationErrors.status) {
      auth.signInWithEmailAndPassword(email, password)
        .then((res) => {
          // Signed in
          dispatch(setNotice({ name: 'loginNotice', msg: 'Login successfull!', code: 3 }))
          return firestore.collection('users').where('id', '==', res.user?.uid)
            .get()
            .then((snapshot) => {
              let userType;
              snapshot.forEach((doc) => {
                userType = doc.data().type;
              });
              return userType;
            });
        })
        .then((userType) => {
          setTimeout(() => {
            if (userType === "admin") {
              console.log('admin navigation')
              navigate("/hr/home");
            } else if (userType === "user") {
              console.log('user navigation')
              navigate("/user/");
            }
            dispatch(delNotice('loginNotice'));
          }, 2000);

        }
        )
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          dispatch(setNotice({ name: 'loginNotice', msg: errorMessage, code: 1 }))
        });
    }
  };

  const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    let errors: {
      status: boolean;
      email?: string;
      password?: string;
    } = { status: false };
    const { name, value } = e.currentTarget;

    if (name === 'email' && !(/(.+)@(.+){2,}\.(.+){2,}/.test(value))) {
      errors.email = 'Invalid Email'
      errors.status = true
    }
    else if (name === 'password' && value.length < 6) {
      errors.password = 'Invalid password'
      errors.status = true
    }
    else {
      errors = { ...errors, [name]: null };
      (errors.email == null && errors.password == null) && (errors.status = false);
    }
    setValidationErrors({
      ...ValidationErrors,
      ...errors
    });
    console.log(errors)
  };



  return (
    <section className='bg-cover h-screen	flex items-center' style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 to-black opacity-70"></div>
      <div className="w-4/12 sm:w-11/12 mx-auto bg-white h-max z-10">
        <Notice typeProp='loginNotice' />
        <form onSubmit={handleLogin} className=' p-10 '>
          <h4 className="text-2xl text-center mb-4 text-defaultBg">Login</h4>
          <div className="mb-4">
            <label className="block  text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              defaultValue='hr@mail.com'
              onBlur={handleChange}
            />
            {ValidationErrors.email &&
              <p className='text-red-700 text-xs'>{ValidationErrors?.email}</p>
            }
          </div>
          <div className="mb-4">
            <label className="block  text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              defaultValue='123456'
              onBlur={handleChange}
            />
            {ValidationErrors.password &&
              <p className='text-red-700 text-xs'>{ValidationErrors?.password}</p>
            }
          </div>
          <button
            className="bg-color-one hover:bg-color-three text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>

    </section>
  )
}
export default Login