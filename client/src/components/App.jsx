import React, { useState } from 'react';

const App = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <span>Tweak this to see new value!</span>
      <input type="range" name="ranger" min="1" max="200" onChange={(e) => setValue(e.target.value)} />
      <h5>
        New Value:
        {value}
      </h5>
    </div>
  );
};

export default App;
