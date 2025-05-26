import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BagProvider } from './context/BagContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home'
import Women from './pages/Women/Women';
import Men from './pages/Men/Men';
import NewIn from './pages/NewIn/NewIn';
import Sale from './pages/Sale/Sale';
import Account from './pages/Account/Account';
import CustomerDetails from './pages/CustomerDetails/CustomerDetails';
import Bag from './pages/Bag/Bag';
import Product from './pages/Product/Product'
import Checkout from './pages/Checkout/Checkout';

function App() {

  return (
    <Router>
      <AuthProvider>
        <BagProvider>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home /> } />
                <Route path="/women" element={<Women />} />
                <Route path="/men" element={<Men />} />
                <Route path="/new-in" element={<NewIn />} />
                <Route path="/sale" element={<Sale />} />
                <Route path="/account" element={<Account />} />
                <Route path="/customerdetails" element={<CustomerDetails />} />
                <Route path="/bag" element={<Bag />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/checkout" element={<Checkout />} />                       
              </Routes> 
            </main>
            <Footer />
          </div>
        </BagProvider>
      </AuthProvider>
    </Router>
  );

}

export default App;