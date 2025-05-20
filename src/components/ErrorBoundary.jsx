import React from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";
import "../styles/ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error atrapado por ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });

    // Registrar el error (podrías enviar a un servicio de monitoreo)
    console.error("Componente:", this.props.componentName || "Desconocido");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);

    // Si el error es de tipo NotFoundError relacionado con removeChild,
    // podría ser un problema de React con componentes desmontados
    if (error.name === 'NotFoundError' && error.message.includes('removeChild')) {
      console.warn('Error de React relacionado con removeChild. Este error suele ser inofensivo y relacionado con componentes desmontados.');

      // Para errores de removeChild, intentamos recuperarnos automáticamente
      // en lugar de mostrar la UI de error
      this.setState({ hasError: false, error: null, errorInfo: null });

      // Si estamos en un componente relacionado con la autenticación,
      // intentamos recargar la página para resolver el problema
      if (this.props.componentName &&
          (this.props.componentName.includes('Auth') ||
           this.props.componentName.includes('Login') ||
           this.props.componentName === 'HomePage')) {
        console.log('Intentando recuperarse automáticamente del error de removeChild...');

        // Usar setTimeout para permitir que React complete el ciclo actual
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });

    // Intentar recuperarse del error
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      // Si no hay un manejador específico, intentar recargar la página
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Renderizar UI de fallback
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <FaExclamationTriangle className="error-icon" />
            <h2>Algo salió mal</h2>
            <p>Ha ocurrido un error en la aplicación.</p>

            {this.props.showDetails && (
              <details className="error-details">
                <summary>Detalles del error</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </details>
            )}

            <button className="reset-button" onClick={this.handleReset}>
              <FaRedo className="button-icon" /> Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
