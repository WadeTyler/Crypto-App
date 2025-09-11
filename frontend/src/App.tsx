import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Navbar from "./components/navbar/Navbar";
import AuthPage from "./pages/AuthPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import {getCurrentUser} from "./features/auth/auth.api.ts";
import {useEffect} from "react";
import ProfilePage from "./pages/ProfilePage.tsx";
import LoadingPage from "./pages/LoadingPage.tsx";
import CoinPage from "./pages/CoinPage.tsx";
import PortfolioPage from "./pages/PortfolioPage.tsx";
import Footer from "./components/Footer.tsx";


export default function App() {

  const {data: authUser, isPending: isLoadingAuthUser} = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    console.log("Auth User:", authUser);
  }, [authUser]);

  return (
    <BrowserRouter>
        <Navbar/>

      {isLoadingAuthUser && (
        <LoadingPage />
      )}
      {!isLoadingAuthUser && (
        <Routes>
          <Route path="/auth" element={authUser ? <Navigate to="/portfolio"/> : <AuthPage />}/>
          <Route path="/profile" element={!authUser ? <Navigate to="/auth"/> : <ProfilePage />}/>
          <Route path="/portfolio" element={!authUser ? <Navigate to="/auth"/> : <PortfolioPage />}/>
          <Route path="/coins/:id" element={<CoinPage />} />
          <Route path="/" element={<HomePage/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
      )}

      <Footer />
    </BrowserRouter>
  )
}