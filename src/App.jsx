import './App.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import { Link } from 'react-router-dom';
import DoodleItImage from './Images/DoodleIt.png';

//import PostDetails from './pages/PostDetails'; 

const App = () => {

  // const backgroundStyle = {
  //   backgroundImage: "url('/images/bluee.png')",
  //   backgroundSize: 'cover',
  //   backgroundPosition: 'center',
  // };

  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: <Home title="Challenges" />  // Pass title for Home
    },
    {
      path:"/edit/:id",
      element: <EditPost title="Edit Challenge" />  // Pass title for EditPost
    },
    {
      path:"/new",
      element: <CreatePost title="New Challenge" />  // Pass title for CreatePost
    },
  
    // {
    //   path: '/post/:id',  
    //   element: <PostDetails />
    // }
  ]);

  return ( 


    <div className="App">
      <header className="header">
        <div className="header-left" style={{ fontFamily: 'Finger Paint, sans-serif' }} >
        <img src={DoodleItImage} alt="Doodle It Logo" className="logo" style={{ transform: 'translateX(-40px)' }} />
        </div>
        <div className="header-right">
          <Link to="/"><button className="headerBtn">Explore Challenge</button></Link>
          <Link to="/new"><button className="headerBtn">Create Challenge</button></Link>
        </div>
      </header>

      {/* Add the wrapper for correct spacing */}
      <div className="main-wrapper">
        <main className="main-content">
          {element}  {/* Render the page content based on the current route */}
        </main>
      </div>
    </div>



  );
}

export default App;