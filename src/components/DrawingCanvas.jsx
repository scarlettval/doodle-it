// src/components/DrawingCanvas.jsx
import React, { useRef, useState } from 'react';
import { supabase } from '../client';

const DrawingCanvas = ({ postId }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    context.stroke();
  };

  const endDrawing = () => {
    setDrawing(false);
  };

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png'); // Get base64 image data
    console.log('Image Data:', imageData); // Log image data to check

    const encodedImageData = encodeURIComponent(imageData);
    console.log('Encoded Image Data:', encodedImageData); // Log encoded data

    console.log('Image Data Length:', imageData.length); // Log length of the image data

    try {
      const { data, error } = await supabase.from('Drawings').insert([
        {
          image_data: encodedImageData, // Insert the encoded image data
          post_id: postId || null, // Make sure post_id is correct or null if not applicable
        },
      ]);

      console.log('Supabase Response:', { data, error }); // Log Supabase response

      if (error) {
        console.error('Error saving drawing:', error); // Log error to console if any
      } else {
        alert('Drawing saved successfully!');
      }
    } catch (error) {
      console.error('Unexpected error saving drawing:', error); // Log unexpected errors
    }
  };

  return (
    <div className="drawing-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '2px solid black', background: 'white' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      <div>
        <button onClick={saveDrawing} className="save-drawing-button">
          Save Drawing
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
