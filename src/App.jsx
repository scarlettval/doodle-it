import './App.css';
import React from 'react';
import { useRoutes } from 'react-router-dom'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import { Link } from 'react-router-dom'
import PostDetails from './pages/PostDetails'; 




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
      element:<Home />
    },
    {
      path:"/edit/:id",
      element: <EditPost />
    },
    {
      path:"/new",
      element: <CreatePost />
    },
    {
      path: '/post/:id',  
      element: <PostDetails />
    }
  ]);

  return ( 


    <div className="App" style={backgroundStyle}>
      <div className="header-buttons">
          <Link to="/"><button className="headerBtn">Explore Toons</button></Link>
          <Link to="/new"><button className="headerBtn">Create Toon</button></Link>
        </div>
        
      <div className="header">
        <div className="header-title">
          <h1>Toon Squad</h1>
          <h2>A Scarlett Valencia Production</h2>
        </div>

        
      </div>

      {element}
    </div>



  );
}

export default App;