import React, { useState } from 'react';

export default function Temp() {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (password === '8899') {
        window.location.href = '/control-room'
    } else {
      alert('Nah, you are not my master!');
      window.location.href = '/'
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'black' }}>
        Oops, proof if you are really Wilmer!!
      </h1>
      <p
        style={{
          color: 'gray',
          fontSize: '1.25rem',
          fontStyle: 'italic',
        }}
      >
        What's the pass phrase?
      </p>
      <div style={{ marginTop: '20px' }}>
        <input
          type="password"
          placeholder="Enter pass phrase"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            fontSize: '1rem',
            padding: '10px',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleConfirm}
          style={{
            fontSize: '1.5rem',
            padding: '10px 20px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
