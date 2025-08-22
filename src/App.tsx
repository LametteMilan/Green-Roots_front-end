import { Route, Routes, Navigate } from 'react-router-dom';
import AboutUs from './components/AboutUs/AboutUs';
import Account from './components/Account/Account';
import AccountOrders from './components/Account/AccountOrders/AccountOrders';
import AccountOrderDetail from './components/Account/AccountOrderDetail/AccountOrderDetail';
import AccountBookmarks from './components/Account/AccountBookmarks/AccountBookmarks';
import Cart from './components/Cart/Cart';
import Landing from './components/Landing/Landing';
import Products from './components/Products/Products';
import Notices from './components/Notices/Notices';
import Dashboard from './components/Dashboard/Dashboard';
import ProductsList from './components/Dashboard-products/ProductsList';
import AddProduct from './components/Dashboard-add-product/AddProduct';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type IProducts from './@types/products';
import ProductDetail from './components/ProductDetail/ProductDetail';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './components/auth/Login';
import type ICart from './@types/cart';
import type IOrders from './@types/orders';
import Policy from './components/Policy/Policy';

function App() {
  const base_url = import.meta.env.VITE_BASE_URL;
  const [allProducts, setAllProducts] = useState<IProducts[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allBookmarks, setAllBookmarks] = useState<IProducts[]>([]);
  const [cart, setCart] = useState<ICart | null>(null); 
  const [orders, setOrders] = useState<IOrders[]>([]);

  useEffect(() => {
    axios.defaults.baseURL = base_url;
  }, [base_url]);

  const getProducts = async () => {
    setErrorMessage('');
    try {
      const response = await axios.get('/products');
      setAllProducts(response.data);
    } catch (e) {
      setErrorMessage('Erreur de chargement des produits');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <AuthProvider>
      {errorMessage && <div className="error-banner">{errorMessage}</div>}
      {/* {isLoading && <div className="loader" />} */}

      <Routes>
        {/* Authentification */}
        <Route
          path="/login"
          element={<Login onSuccess={() => window.location.replace('/')} />}
        />

        {/* Routes publiques */}
        <Route
          path="/"
          element={<Landing allProducts={allProducts} cart={cart} setCart={setCart} />}
        />
        <Route
          path="/products"
          element={
            <Products allProducts={allProducts} cart={cart}/>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductDetail
              allBookmarks={allBookmarks}
              setAllBookmarks={setAllBookmarks}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/policy" element={<Policy />} />

        {/* Routes protégées - utilisateur connecté */}
        <Route
          element={<ProtectedRoute roles={['customer', 'manager', 'admin']} />}
        >
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<AccountOrders orders={orders} setOrders={setOrders} />} />
          <Route
            path="/account/orders/detail"
            element={<AccountOrderDetail />}
          />
          <Route
            path="/account/bookmarks"
            element={
              <AccountBookmarks
                allBookmarks={allBookmarks}
                setAllBookmarks={setAllBookmarks}
                cart={cart}
              />
            }
          />
          <Route
            path="/cart"
            element={<Cart cart={cart} setCart={setCart} isLoading={isLoading} setIsLoading={setIsLoading}/>}
          />
        </Route>

        {/* Routes admin et manager */}
        <Route element={<ProtectedRoute roles={['admin', 'manager']} />}>
          <Route path="/dashboard" element={<Dashboard orders={orders} setOrders={setOrders} />} />
          <Route
            path="/dashboard/products"
            element={
              <ProductsList
                allProducts={allProducts}
                setAllProducts={setAllProducts}
              />
            }
          />
        </Route>

        {/* Routes strictement admin */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route
            path="/dashboard/addProducts"
            element={
              <AddProduct
                allProducts={allProducts}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                setIsLoading={setIsLoading}
                setAllProducts={setAllProducts}
              />
            }
          />
        </Route>
        {/* Redirection */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
