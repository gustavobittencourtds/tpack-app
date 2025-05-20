import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/toast.module.css';

const FeatherIcon = dynamic(() => import('feather-icons-react'), { ssr: false });

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Aplica a animação de entrada após o componente ser montado
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Configura o timer para remover automaticamente após 7 segundos
    autoCloseTimerRef.current = setTimeout(() => {
      handleClose();
    }, 7000);

    return () => {
      clearTimeout(timer);
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);
  const handleClose = () => {
    setIsVisible(false);
    // Aguarda a animação de saída terminar antes de chamar onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.toastContent}>
        <span className={styles.icon}>
          <FeatherIcon 
            icon={type === 'success' ? 'check-circle' : 'alert-circle'} 
            size={20} 
          />
        </span>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeButton} onClick={handleClose}>
          <FeatherIcon icon="x" size={18} />
        </button>
      </div>
      <div className={`${styles.progressBar} ${styles[type]}`}></div>
    </div>
  );
};

export default Toast;
