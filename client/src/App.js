import Loginpage from './components/Login&Signup/loginpage'
import { Route, Routes } from 'react-router-dom'
import Interface from './components/quiz_inteface/interface'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Loginpage />} />
      <Route path='/user/:userid' element={<Interface />} />
    </Routes>
  );
}

export default App;
