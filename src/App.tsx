import Index from "./pages/index";
import {Route, Routes} from "react-router-dom";
import TrendLines from "./pages/TrendLines/TrendLines.tsx";

function App() {
  return <div className='w-full h-screen bg-[#0e1017]'>
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/trend-lines' element={<TrendLines />} />
    </Routes>
  </div>
}

export default App;
