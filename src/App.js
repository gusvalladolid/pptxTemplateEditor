import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import EditTemplate from './views/editTemplate';

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route  path='/' element={<Home/>}/>
        <Route  path='/template' element={<EditTemplate/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
