import React from 'react';
import Env from './env/3Denv';
import '../styles/style.scss';

// Parent component to run all children.
const App = () => (
  <div>
    {/* Environment for 3D NEAT */}
    <Env />
  </div>
);

export default App;
