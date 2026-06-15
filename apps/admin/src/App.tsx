import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './stores/providers/StoreProvider';
import { AuthProvider } from './Auth/Providers/AuthProvider';
import { ProtectedRoute } from './Common/ProtectedRoute';
import { LoginRoute } from './Auth/Routes/LoginRoute';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import { OrdersRoute } from './Orders/Routes/OrdersRoute';
import { OrdersProvider } from './Orders/Providers/OrdersProvider';
import { OnboardingRoute } from './Onboarding/Routes/OnboardingRoute';
import { OnboardingDetailRoute } from './Onboarding/Routes/OnboardingDetailRoute';
import { OnboardingProvider } from './Onboarding/Providers/OnboardingProvider';
import { CategoriesRoute } from './Categories/Routes/CategoriesRoute';
import { SubcategoriesRoute } from './Categories/Routes/SubcategoriesRoute';
import { CategoriesProvider } from './Categories/Providers/CategoriesProvider';
import { ShopTypeCategoriesRoute } from './Shops/Routes/ShopTypeCategoriesRoute';
import { ShopTypeCategoriesProvider } from './Shops/Providers/ShopTypeCategoriesProvider';
import ShopTypesRoute from './Shops/Routes/ShopTypesRoute';
import { ShopTypesProvider } from './Shops/Providers/ShopTypesProvider';
import Customers from './pages/Customers';
import DeliveryPartners from './pages/DeliveryPartners';
import Bargaining from './pages/Bargaining';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="stores" element={<Stores />} />
                <Route path="shop-types" element={<ShopTypesProvider><ShopTypesRoute /></ShopTypesProvider>} />
                <Route path="categories" element={<CategoriesProvider><CategoriesRoute /></CategoriesProvider>} />
                <Route path="categories/:categoryId/subcategories" element={<CategoriesProvider><SubcategoriesRoute /></CategoriesProvider>} />
                <Route path="onboarding" element={<OnboardingProvider><OnboardingRoute /></OnboardingProvider>} />
                <Route path="onboarding/:shopId" element={<OnboardingProvider><OnboardingDetailRoute /></OnboardingProvider>} />
                <Route path="orders" element={<OrdersProvider><OrdersRoute /></OrdersProvider>} />
                <Route path="customers" element={<Customers />} />
                <Route path="delivery" element={<DeliveryPartners />} />
                <Route path="bargaining" element={<Bargaining />} />
                <Route path="payments" element={<Payments />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="support" element={<Support />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route
                  path="shop-types/:shopTypeId/categories"
                  element={
                    <CategoriesProvider>
                      <ShopTypeCategoriesProvider>
                        <ShopTypeCategoriesRoute />
                      </ShopTypeCategoriesProvider>
                    </CategoriesProvider>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </AuthProvider>
  );
}
