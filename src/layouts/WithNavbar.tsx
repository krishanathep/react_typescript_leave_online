import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const WithNavbar = () => {
  return (
    <div className="wrapper">
      <Navbar/>
      <Sidebar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default WithNavbar