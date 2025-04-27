import React, { useState, useEffect } from 'react';
import { supabase } from '../client';  // Ensure this path is correct
import Card from '../components/Card.jsx';  // Assuming you have a Card component
import './Home.css'; // Adjust the path as needed

const sortOptions = [
  { label: 'Trending', value: 'trending' },
  { label: 'Newest', value: 'newest' },
  { label: 'Top', value: 'top' },
];

const Home = ({ title }) => {  // Accept title prop
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('trending');
  const [loading, setLoading] = useState(true);

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
    switch (sortBy) {
      case 'newest':
        return [...posts].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'top':
        return [...posts].sort((a, b) => b.upvotes - a.upvotes);
      case 'trending':
      default:
        return [...posts].sort((a, b) => {
          const aScore = a.upvotes * (1 / Math.max(1, (Date.now() - new Date(a.created_at).getTime()) / 86400000));
          const bScore = b.upvotes * (1 / Math.max(1, (Date.now() - new Date(b.created_at).getTime()) / 86400000));
          return bScore - aScore;
        });
    }
  }, [posts, sortBy]);

  return (
    <div className="Home" style={{ padding: '20px' }}>
      {/* Render the dynamic title */}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2> {/* Display title dynamically */}
      
      {/* Sorting options */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
