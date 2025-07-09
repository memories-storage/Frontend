import React from 'react';
import { useAuth } from '../../context/AuthContext';
import HomeLoggedUser from './HomeLoggedUser';
import HomeNonLoggedUser from './HomeNonLoggedUser';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  // Render different components based on authentication status
  if (isAuthenticated) {
    return <HomeLoggedUser />;
  }

  return <HomeNonLoggedUser />;
};

export default Home; 