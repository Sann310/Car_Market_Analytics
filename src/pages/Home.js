import React, { useState, useEffect, useMemo } from 'react';
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
import { Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Home() {
  const [carModelsData, setCarModelsData] = useState(null);
  const [carCompaniesData, setCarCompaniesData] = useState(null);
  const [carCompaniesTableData, setCarCompaniesTableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hiddenModels, setHiddenModels] = useState({});

  const modelColors = useMemo(() => [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ], []);

  useEffect(() => {
    fetch('taladrod-cars.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.Cars)) {
          const modelsCount = {};
          const companiesCount = {};

          data.Cars.forEach(car => {
            modelsCount[car.Model] = (modelsCount[car.Model] || 0) + 1;

            const company = car.NameMMT.split(' ')[0];
            companiesCount[company] = (companiesCount[company] || 0) + 1;
          });

          setCarModelsData({
            labels: Object.keys(modelsCount),
            datasets: [{
              label: 'Number of Cars',
              data: Object.values(modelsCount),
              backgroundColor: Object.keys(modelsCount).map((_, index) => modelColors[index % modelColors.length]),
            }],
          });

          setCarCompaniesData({
            labels: Object.keys(companiesCount),
            datasets: [{
              data: Object.values(companiesCount),
              backgroundColor: Object.keys(companiesCount).map((_, index) => modelColors[index % modelColors.length]),
            }],
          });

          setCarCompaniesTableData(companiesCount);

          setLoading(false);
        } else {
          console.error('Unexpected data structure:', data);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error loading car data:', error);
        setLoading(false);
      });
  }, [modelColors]);

  const toggleModelVisibility = (modelIndex) => {
    setHiddenModels((prevState) => ({
      ...prevState,
      [modelIndex]: !prevState[modelIndex]
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome To Car Market Thailand</h1>
      <div style={styles.buttonContainer}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={styles.button}>Dashboard</button>
        </Link>
        <Link to="/about" style={{ textDecoration: 'none' }}>
          <button style={styles.button}>About Us</button>
        </Link>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Cars by Model</h2>
        <div style={styles.customLegend}>
          {carModelsData.labels.map((model, index) => (
            <div
              key={model}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '5px',
                cursor: 'pointer',
                opacity: hiddenModels[index] ? 0.5 : 1,
              }}
              onClick={() => toggleModelVisibility(index)}
            >
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  backgroundColor: modelColors[index % modelColors.length],
                  marginRight: '5px',
                }}
              ></div>
              <span>{model}</span>
            </div>
          ))}
        </div>
        <div style={styles.chartContainer}>
          {carModelsData ? (
            <Bar
              data={{
                ...carModelsData,
                datasets: carModelsData.datasets.map((dataset) => ({
                  ...dataset,
                  backgroundColor: carModelsData.labels.map((_, index) =>
                    hiddenModels[index] ? 'rgba(0, 0, 0, 0)' : modelColors[index % modelColors.length]
                  ),
                  data: carModelsData.datasets[0].data.map((value, index) =>
                    hiddenModels[index] ? 0 : value
                  ),
                })),
              }}
              options={{
                plugins: {
                  legend: {
                    display: false, // Hide the default legend
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                    title: {
                      display: true,
                      text: 'Car Models',
                      color: '#ffffff',
                    },
                    ticks: {
                      color: '#ffffff',
                    },
                  },
                  y: {
                    stacked: true,
                    title: {
                      display: true,
                      text: 'Number of Cars',
                      color: '#ffffff',
                    },
                    ticks: {
                      color: '#ffffff',
                    },
                  },
                },
              }}
            />
          ) : (
            <div>No data available for models</div>
          )}
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Cars by Company</h2>
        <div style={styles.doughnutContainer}>
          {carCompaniesData ? (
            <>
              <Doughnut
                data={carCompaniesData}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      labels: {
                        color: '#ffffff',
                      },
                    },
                  },
                }}
              />
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Company</th>
                    <th style={styles.tableHeader}>Number of Cars</th>
                  </tr>
                </thead>
                <tbody>
                  {carCompaniesTableData && Object.entries(carCompaniesTableData).map(([company, count]) => (
                    <tr key={company}>
                      <td style={styles.tableCell}>{company}</td>
                      <td style={styles.tableCell}>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div>No data available for companies</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px',
    fontFamily: "'Montserrat', sans-serif",
    backgroundColor: '#1b1f3a',
    color: '#ffffff',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2.5rem',
    color: '#ffffff',
    marginBottom: '20px',
    border: '3px solid #ffffff',
    padding: '10px',
    display: 'inline-block',
    borderRadius: '8px',
    backgroundColor: '#1b1f3a',
  },
  buttonContainer: {
    marginBottom: '30px',
  },
  button: {
    marginRight: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  card: {
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '40px',
    maxWidth: '1000px',
    margin: '0 auto',
    color: '#ffffff',
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#ffffff',
  },
  chartContainer: {
    maxWidth: '100%',
    margin: '0 auto',
  },
  doughnutContainer: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  table: {
    marginTop: '20px',
    width: '100%',
    textAlign: 'left',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '2px solid #28a745',
    padding: '10px',
    color: '#28a745',
    fontWeight: 'bold',
  },
  tableCell: {
    borderBottom: '1px solid #ddd',
    padding: '10px',
    color: '#ffffff',
  },
  customLegend: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '20px',
  },
};

export default Home;