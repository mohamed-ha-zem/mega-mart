import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Auth/login'
import HomePage from './pages/Website/homePage/homePage'
import Register from './pages/Auth/register'
import Users from './pages/Website/Users/users'
import GoogleCallback from './pages/Auth/GoogleCallback'
import DashBoard from './pages/DashBoard/dashBoard'
import RequireAuth from './pages/Auth/requireAuth'
import UpdateUser from './pages/Website/Users/updateUser'
import AddUser from './pages/Website/Users/addUser'
import Writer from './pages/DashBoard/writer'
import Page404 from './pages/DashBoard/404'
import RequireBack from './pages/Auth/requireBack'
import UpdateCategory from './pages/Website/categories/updateCategory'
import AddCategory from './pages/Website/categories/addCategory'
import Categories from './pages/Website/categories/categories'
import Porducts from './pages/Website/Products/products'
import UpdateProduct from './pages/Website/Products/updateProduct'
import AddProduct from './pages/Website/Products/addProduct'
import Navbar from './pages/Website/homePage/navBar'
import HomeCategories from './pages/Website/homePage/homeCategories'
import Website from './pages/Website/homePage/website'
import SingleProduct from './pages/Website/homePage/product/singleProduct/singleProduct'
import SingleCategory from './pages/Website/homePage/singleCategory'

export default function App() {

  return (
    <div>
      <Routes>
        {/* Globel Links */}
        {/* <Route path='/' element={<HomePage/>}/> */}
        <Route element={<Website/>}>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/homeCategories' element={<HomeCategories/>}/>
          <Route path='/category/:id' element={<SingleCategory/>}/>
          <Route path='/product/:id' element={<SingleProduct/>}/>
        </Route>
        <Route element={<RequireBack/>}>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
        </Route>
        <Route path='/auth/google/callback' element={<GoogleCallback/>}/>
        <Route path='/*' element={<Page404/>}/>
        {/* Protected Links */}
        <Route element={<RequireAuth allowedRole={["1995" , "1996" , "1999"]}/>}>
          <Route path='/dashBoard' element={<DashBoard/>}>
            <Route element={<RequireAuth allowedRole={["1995"]}/>}>
              <Route path='users' element={<Users/>}/>
              <Route path='users/:id' element={<UpdateUser/>}/>
              <Route path='users/add' element={<AddUser/>}/>
            </Route>
            <Route element={<RequireAuth allowedRole={["1995" , "1999"]}/>}>
              <Route path='categories' element={<Categories/>}/>
              <Route path='categories/:id' element={<UpdateCategory/>}/>
              <Route path='categories/add' element={<AddCategory/>}/>
            </Route>
            <Route element={<RequireAuth allowedRole={["1995" , "1999"]}/>}>
              <Route path='products' element={<Porducts/>}/>
              <Route path='products/:id' element={<UpdateProduct/>}/>
              <Route path='products/add' element={<AddProduct/>}/>
            </Route>
            <Route element={<RequireAuth allowedRole={["1996" , "1995"]}/>}>
              <Route path='users/writer' element={<Writer/>}/>
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

