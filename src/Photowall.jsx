import React from 'react';

function Photowall() {
  return (
    <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-x-4 p-4">
      <div className="snap-center flex-shrink-0">
        <img src="src/assets/village1.jpg" className="w-auto md:w-64 lg:w-96 h-96 object-cover rounded-lg shadow-lg transition duration-300 hover:scale-105" />
      </div>
      <div className="snap-center flex-shrink-0">
        <img src="src/assets/village2.jpg" className="w-auto md:w-64 lg:w-96 h-96 object-cover rounded-lg shadow-lg transition duration-300 hover:scale-105" />
      </div>
      <div className="snap-center flex-shrink-0">
        <img src="src/assets/village3.jpg" className="w-auto md:w-64 lg:w-96 h-96 object-cover rounded-lg shadow-lg transition duration-300 hover:scale-105" />
      </div>
      <div className="snap-center flex-shrink-0">
        <img src="src/assets/village4.jpg" className="w-auto md:w-64 lg:w-96 h-96 object-cover rounded-lg shadow-lg transition duration-300 hover:scale-105" />
      </div>
      <div className="snap-center flex-shrink-0">
        <img src="src/assets/village5.jpg" className="w-auto md:w-64 lg:w-96 h-96 object-cover rounded-lg shadow-lg transition duration-300 hover:scale-105" />
      </div>
    </div>
  );
}

export default Photowall;