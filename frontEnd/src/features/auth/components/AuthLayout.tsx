import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">{children}</div>
    </div>
  );
}

export default AuthLayout;
