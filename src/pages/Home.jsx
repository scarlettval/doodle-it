import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import Card from '../components/Card.jsx';
import './Home.css';

const Home = ({ title }) => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('trending'); // default sort
  const [category, setCategory] = useState('forum'); // no category filter by default
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('Posts')
        .select()
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter and sort posts based on user's selections
  const sortedPosts = React.useMemo(() => {
    let filteredPosts = posts;

    // Apply search filter if any
    if (searchQuery) {
      filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category (Forum or Challenge)
    if (category) {
      filteredPosts = filteredPosts.filter((post) => post.type === category);
    }

    // Sorting logic
    switch (sortBy) {
      case 'newest':
        return filteredPosts.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'top':
        return filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
      case 'trending':
      default:
        return filteredPosts.sort((a, b) => {
          const aScore =
            a.upvotes *
            (1 / Math.max(1, (Date.now() - new Date(a.created_at).getTime()) / 86400000));
          const bScore =
            b.upvotes *
            (1 / Math.max(1, (Date.now() - new Date(b.created_at).getTime()) / 86400000));
          return bScore - aScore;
        });
    }
  }, [posts, sortBy, searchQuery, category]);

  return (
    <div className="Home" style={{
      transform: 'translateX(300px)',  // Use transform for translation
      textAlign: 'center',
      backgroundColor: '#e7e5e5',
      borderRadius: '12px',
      padding: '60px',
      marginTop: '30px',
      width: '90%',
      maxWidth: '1200px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    }}>

      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

      {/* Search Bar */}
      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="  Search for posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
        />
      </div>

{/* Sorting and Category Buttons */}
<div className="filters">
  {/* Sort Buttons */}
  <div className="flex justify-between items-center mb-6 w-full">
    {/* Sorting buttons will take available space */}
    <div className="flex items-center space-x-2">
      {['trending', 'newest', 'top'].map((option) => (
        <button
          key={option}
          onClick={() => setSortBy(option)}
          className={`px-3 py-1 text-sm ${sortBy === option ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>

    {/* Category Buttons */}
    <div className="flex items-center space-x-4">
      {['forum', 'challenges'].map((type) => (
        <button
          key={type}
          onClick={() => setCategory(type)}
          className={`px-3 py-1 text-sm ${category === type ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  </div>
</div>



      {/* Loading state */}
      {loading ? (
        <h2>Loading posts...</h2>
      ) : posts.length === 0 ? (
        <h2>No posts available 😞</h2>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPosts.map((post) => (
            <Card
              key={post.id}
              id={post.id}
              title={post.title}
              created_at={post.created_at}
              upvotes={post.upvotes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
