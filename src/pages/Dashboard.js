import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [cars, setCars] = useState([]);
  const [highlightedCars, setHighlightedCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    fetch('/Car_Market_Analytics/taladrod-cars.json')
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.Cars)) {
          setCars(data.Cars);
          setFilteredCars(data.Cars); // Initially display all cars
        } else {
          console.error('Unexpected data structure:', data);
        }
      })
      .catch(error => {
        console.error('Error loading car data:', error);
      });

    const savedHighlightedCars = JSON.parse(localStorage.getItem('highlightedCars')) || [];
    setHighlightedCars(savedHighlightedCars);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = cars.filter(car =>
      car.NameMMT.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCars(filtered);
  };

  const addCarToHighlight = (car) => {
    if (!highlightedCars.some(highlightedCar => highlightedCar.Cid === car.Cid)) {
      const updatedHighlightedCars = [...highlightedCars, car];
      setHighlightedCars(updatedHighlightedCars);
      localStorage.setItem('highlightedCars', JSON.stringify(updatedHighlightedCars));
    }
  };

  const removeCarFromHighlight = (carId) => {
    const updatedHighlightedCars = highlightedCars.filter((car) => car.Cid !== carId);
    setHighlightedCars(updatedHighlightedCars);
    localStorage.setItem('highlightedCars', JSON.stringify(updatedHighlightedCars));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Cars Market</h1>

      {/* Navigation Buttons */}
      <div style={styles.navButtons}>
        <a href="/" style={styles.navButton}>Home</a>
        <a href="/about" style={styles.navButton}>About Us</a>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={handleSearch} 
          placeholder="Search for cars..." 
          style={styles.searchInput} 
        />
      </div>

      <div style={styles.section}>
        <h2>Highlighted Cars</h2>
        {highlightedCars.length > 0 ? (
          <div style={styles.carGrid}>
            {highlightedCars.map((car) => (
              <div key={car.Cid} style={styles.carBox}>
                <div style={styles.carHeader}>
                  <h3 style={styles.carTitle}>{car.NameMMT}</h3>
                </div>
                <div style={styles.carContent}>
                  <img src={car.Img100} alt={car.Model} style={styles.carImage} />
                  <div style={styles.carDetails}>
                    <p>Price: {car.Prc} Baht</p>
                    <p>Status: {car.Status || 'N/A'}</p>
                    <p>Province: {car.Province || 'N/A'}</p>
                    <button onClick={() => removeCarFromHighlight(car.Cid)} style={styles.removeButton}>
                      Remove from Highlight
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No cars highlighted yet.</p>
        )}
      </div>

      <div style={styles.section}>
        <h2>Find Your Cars</h2>
        {filteredCars.length > 0 ? (
          <div style={styles.carGrid}>
            {filteredCars.map((car) => (
              <div key={car.Cid} style={styles.carBox}>
                <div style={styles.carHeader}>
                  <h3 style={styles.carTitle}>{car.NameMMT}</h3>
                </div>
                <div style={styles.carContent}>
                  <img src={car.Img100} alt={car.Model} style={styles.carImage} />
                  <div style={styles.carDetails}>
                    <p>Price: {car.Prc} Baht</p>
                    <p>Status: {car.Status || 'N/A'}</p>
                    <p>Province: {car.Province || 'N/A'}</p>
                    {highlightedCars.some(highlightedCar => highlightedCar.Cid === car.Cid) ? (
                      <button onClick={() => removeCarFromHighlight(car.Cid)} style={styles.removeButton}>
                        Remove from Highlight
                      </button>
                    ) : (
                      <button onClick={() => addCarToHighlight(car)} style={styles.addButton}>
                        Add to Highlight
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No cars found.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: "'Montserrat', sans-serif",
    color: '#ffffff',
    backgroundColor: '#1b1f3a',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#ffffff',
    borderBottom: '2px solid #ffffff',
    paddingBottom: '10px',
  },
  navButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  navButton: {
    padding: '15px 30px',
    borderRadius: '5px',
    backgroundColor: '#4b6584',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  searchInput: {
    padding: '10px',
    width: '50%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  section: {
    marginBottom: '40px',
  },
  carGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  carBox: {
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'left',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '2px solid #9966ff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  carHeader: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  carTitle: {
    margin: '0',
    fontSize: '1.2rem',
    color: '#ffffff',
  },
  carContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  carImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    marginBottom: '10px',
    objectFit: 'contain',
  },
  carDetails: {
    width: '100%',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
  },
};

export default Dashboard;