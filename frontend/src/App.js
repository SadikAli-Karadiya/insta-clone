import {useHistory} from "react-router-dom";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux'
import  deleteAction from '../src/redux/actions/action';
import action from '../src/redux/actions/action'

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    const expiryDate = localStorage.getItem('EXPIRY_DATE');
    if(Date.now().toLocaleString() > expiryDate){
      localStorage.clear();
      dispatch(deleteAction());
    }

    const user = localStorage.getItem('USER');
    if(user) {
      dispatch(action(user)) ;
      history.push('/')
    } else {
      if(!history.location.pathname.startsWith('/resetpassword')) // Can access reset password page without signin
      {
        history.push('/signin')
      }
    }
  }, []);

  return (
    <>
        <Navbar />
    </>
  );
}

export default App;
