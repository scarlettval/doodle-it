import React, { useState, useEffect } from 'react';
import { supabase } from '../client';  // Ensure this path is correct
import Card from '../components/Card.jsx';  // Assuming you have a Card component
import './Home.css'; // Adjust the path as needed

const sortOptions = [
  { label: 'Trending', value: 'trending' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most Upvotes', value: 'top' },
];

const Home = ({ title }) => {  // Accept title prop
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('trending');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');  // New state for search query

  // Handle upvote
  const handleUpvote = async (id, currentUpvotes) => {
    try {
      const { error } = await supabase
        .from('Posts')
        .update({ upvotes: currentUpvotes + 1 })
        .eq('id', id);

      if (error) throw error;

      // After successful upvote, update state to re-render
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, upvotes: post.upvotes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  // Fetch posts from Supabase
  useEffect(() => {
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

    fetchPosts();
  }, []);

  // Sorting logic
  const sortedPosts = React.useMemo(() => {
    let filteredPosts = posts;

    // If there is a search query, filter posts based on title
    if (searchQuery) {
      filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting based on selected option
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
  }, [posts, sortBy, searchQuery]); // Recalculate when searchQuery changes

  return (
    <div className="Home" style={{
      transform: 'translateX(300px)',  // Use transform for translation
      textAlign: 'center',
      backgroundColor: '#e7e5e5', // Use camelCase for background-color
      borderRadius: '12px', // Use camelCase for border-radius
      padding: '60px',
      marginTop: '30px',
      width: '90%',
      maxWidth: '1200px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.15)', // Use camelCase for box-shadow
    }}>


       {/* Render the dynamic title */}
       <h2 className="text-2xl font-bold text-gray-800">{title}</h2> {/* Display title dynamically */}

      {/* Search Bar */}
      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="  Search for challenge!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}  // Update search query on change
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '100px',
            border: '1px solid #ccc',
            marginBottom: '20px',
          }}
        />
      </div>

      {/* Sorting options */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="border border-gray-300 rounded-full overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`px-3 py-1 text-sm ${sortBy === option.value ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
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
        // Render posts in grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPosts.map((post) => (
            <Card
              key={post.id}
              id={post.id}
              title={post.title}
              created_at={post.created_at}
              upvotes={post.upvotes}  // pass the upvotes
              onUpvote={() => handleUpvote(post.id, post.upvotes)}  // pass the click handler
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
