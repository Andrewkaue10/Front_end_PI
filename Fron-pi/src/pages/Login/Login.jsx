import { api, saveSession } from "../../lib/api";
import { useState } from "react";
import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/forms.css";
import "./Login.css";

function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.target);
    const email = form.get("email");
    const senha = form.get("senha");

    const faltando = [];
    if (!email || !email.trim()) faltando.push("E-mail");
    if (!senha || !senha.trim()) faltando.push("Senha");

    if (faltando.length > 0) {
      setError(`Preencha: ${faltando.join(", ")}.`);
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      const remember = !!form.get("manterConectado");
      const result = await api("/auth/login", {
        method: "POST",
        body: { email, senha, manterConectado: remember },
      });
      saveSession(result.access_token, remember);
      navigate("/feed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-blue login-page">
      <section className="login-page__visual">
        <h2>Bem-vindo de volta.</h2>
        <p>
          Acesse sua conta para acompanhar seus matches, conversas e novas
          oportunidades.
        </p>
      </section>

      <section className="login-page__form-side">
        <div className="login-page__panel">
          <p className="login-page__top-link">
            Ainda não tem conta?{" "}
            <Link to="/cadastro/startup">Cadastre-se →</Link>
          </p>

          <form
            className="auth-form login-page__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <h1>Entrar na NexHub</h1>
            <p className="auth-form__subtitle">
              Use o e-mail e a senha da sua conta Nexhub.
            </p>

            <div className="auth-form__field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="voce@empresa.com"
                required
              />
            </div>

            <div className="auth-form__field">
              <div className="auth-form__field-header">
                <label htmlFor="senha">Senha</label>
                <Link to="/esqueci-senha" className="auth-form__forgot">
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <label className="auth-form__checkbox">
              <input type="checkbox" name="manterConectado" />
              <span className="checkbox-box">
                <Check size={12} strokeWidth={3} />
              </span>
              Manter-me conectado
            </label>

            {error && (
              <div className="form-alert" role="alert">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="auth-form__submit"
            >
              Entrar →
            </button>

            <div className="auth-form__divider">
              Login social (ainda não disponível)
            </div>

            <div className="auth-form__social">
              <button
                type="button"
                disabled
                title="Login social ainda não configurado"
              >
                <span className="social-icon social-icon--google">G</span>
                Gmail
              </button>
              <button
                type="button"
                disabled
                title="Login social ainda não configurado"
              >
                <span className="social-icon social-icon--linkedin">in</span>
                LinkedIn
              </button>
            </div>

            <p className="auth-form__bottom-link">
              Novo por aqui? <Link to="/cadastro/startup">Criar conta</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
