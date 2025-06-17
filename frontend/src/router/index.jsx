import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import HomePage from '../components/HomePage/HomePage';
import PlantPage from '../components/PlantPage/PlantPage'
import RoomPage from '../components/RoomPage/RoomPage'
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
                
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "plants",
        element: <PlantPage />
      },
      {
        path: "rooms",
        element: <RoomPage />
      },
    ],
  },
]);