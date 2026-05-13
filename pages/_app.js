import Navbar from '../components/Navbar';
import '../styles/myshop.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        fontSize: '13px',
        color: '#999',
        borderTop: '1px solid #f0ede8',
        marginTop: '48px'
      }}>
        © {new Date().getFullYear()} Myshop. Toate drepturile rezervate.
      </footer>
    </>
  );
}
