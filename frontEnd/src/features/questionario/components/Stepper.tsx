import React from 'react';
import './Stepper.css';

interface StepperProps {
  etapaAtual: number;
}

function Stepper({ etapaAtual }: StepperProps) {
  return (
    <div className="stepper">
      <div className={`step ${etapaAtual >= 1 ? 'active' : ''}`}>
        <div className="step-circle">1</div>
        <div className="step-label">
          <div className="step-label-1">Solicitante</div>
          <div className="step-label-2">Dados de quem busca o</div>
        </div>
      </div>
      <div className={`step ${etapaAtual >= 2 ? 'active' : ''}`}>
        <div className="step-circle">2</div>
        <div className="step-label">
          <div className="step-label-1">Socioeconômico</div>
          <div className="step-label-2">Análise familiar</div>
        </div>
      </div>
      <div className={`step ${etapaAtual >= 3 ? 'active' : ''}`}>
        <div className="step-circle">3</div>
        <div className="step-label">
          <div className="step-label-1">Socioeconômico</div>
          <div className="step-label-2">Análise familiar</div>
        </div>
      </div>
      <div className={`step ${etapaAtual >= 4 ? 'active' : ''}`}>
        <div className="step-circle">4</div>
        <div className="step-label">
          <div className="step-label-1">se</div>
          <div className="step-label-2">Área de atuação</div>
        </div>
      </div>
    </div>
  );
}

export default Stepper;
