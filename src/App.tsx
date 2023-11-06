import Index from "./pages/index";
import {Route, Routes} from "react-router-dom";

function App() {
  return <div className='w-full h-screen bg-[#0e1017]'>
    <Routes>
      <Route path='/' element={<Index />} />
    </Routes>
  </div>
}

export default App;
