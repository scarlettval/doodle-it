import React, { useRef, useState } from 'react';

const DrawingCanvas = ({ postId, onSaveDrawing }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    setDrawing(false);
  };

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png'); // Get base64 image data

    // Pass image data to parent component
    if (onSaveDrawing) {
      onSaveDrawing(imageData);
    }

    // Show confirmation pop-up
    alert('Your drawing has been saved! You can Post and/or add a Caption :D');
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
        <button onClick={saveDrawing} className="save-drawing-button"  style={{ border: '2px solid black', background: 'white'  }}>
          Save Drawing
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
