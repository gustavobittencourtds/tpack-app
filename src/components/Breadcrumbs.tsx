import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/breadcrumbs.module.css';

interface BreadcrumbsProps {
  title?: string; // Prop opcional para o título da página atual
}

const Breadcrumbs = ({ title }: BreadcrumbsProps) => {
  const router = useRouter();
  const paths = router.pathname.split('/').filter(Boolean); // Divide a rota em partes

  return (
    <div className={styles.breadcrumbs}>
      <Link href="/admin">Início</Link>
      {title && (
        <span>
          {' / '}
          <span>{title}</span>
        </span>
      )}
    </div>
  );
};

export default Breadcrumbs;