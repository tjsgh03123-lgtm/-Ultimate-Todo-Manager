import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 참고: react-beautiful-dnd는 React.StrictMode의 이중 렌더링과 호환되지 않아
// (드래그 중 경고/오작동 발생) 의도적으로 StrictMode 없이 렌더링합니다.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service worker 등록 실패:', err);
    });
  });
}
