import './App.css';
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import CreatePost2 from './pages/CreatePost2';
import EditPost from './pages/EditPost';
import { Link } from 'react-router-dom';
import DoodleItImage from './Images/DoodleIt.png';
import PostPage from './pages/PostPage';  
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
    element: <Home title="Explore" />
  },
  {
    path:"/edit/:id",
    element: <EditPost title="Edit Challenge" />
  },
  {
    path:"/new-challenge",
    element: <CreatePost title="New Challenge" />
  },
  {
    path:"/new-post",
    element: <CreatePost2 title="New Post" />
  },
  {
    path: '/post/:id',  
    element: <PostPage />   // <-- NOW we use the smart PostPage
  }
]);


  return ( 


    <div className="App">
      <header className="header">
        <div className="header-left" style={{ fontFamily: 'Finger Paint, sans-serif' }} >
        <img src={DoodleItImage} alt="Doodle It Logo" className="logo" style={{ transform: 'translateX(-40px)' }} />
        </div>
        <div className="header-right">
          <Link to="/"><button className="headerBtn">Explore</button></Link>
          <Link to="/new-post"><button className="headerBtn">Create Forum Post</button></Link>
          <Link to="/new-challenge"><button className="headerBtn">Create Challenge</button></Link>
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