import React, { Component } from 'react';

class Home extends Component {
  render() {
    const styles = {
      container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        fontFamily: 'Segoe UI, sans-serif',
      },

      card: {
        backdropFilter: 'blur(15px)',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '50px 80px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        color: '#fff',
        animation: 'fadeIn 1s ease',
      },

      title: {
        fontSize: '56px',
        fontWeight: 'bold',
        marginBottom: '10px',
        letterSpacing: '1px',
      },

      subtitle: {
        fontSize: '18px',
        opacity: 0.8,
      },

      badge: {
        marginTop: '20px',
        display: 'inline-block',
        padding: '8px 16px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.2)',
        fontSize: '14px',
      }
    };

    return (
      <div style={styles.container}>
        {/* Animation */}
        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>

        <div style={styles.card}>
          <h1 style={styles.title}>Chào Bạn 👋</h1>
          <p style={styles.subtitle}>
            Chào mừng bạn đến với hệ thống quản trị
          </p>

          <div style={styles.badge}>
            ADMIN DASHBOARD
          </div>
        </div>
      </div>
    );
  }
}

export default Home;