import React from 'react';

interface StepperProps {
  etapaAtual: number;
}

function Stepper({ etapaAtual }: StepperProps) {
  return (
    <div className="stepper">
      <div className={`step ${etapaAtual >= 1 ? 'active' : ''}`}>
        <div className="step-circle">1</div>
        <div className="step-label">Dados Pessoais</div>
      </div>
      <div className={`step ${etapaAtual >= 2 ? 'active' : ''}`}>
        <div className="step-circle">2</div>
        <div className="step-label">Socioeconômico</div>
      </div>
      <div className={`step ${etapaAtual >= 3 ? 'active' : ''}`}>
        <div className="step-circle">3</div>
        <div className="step-label">Serviços</div>
      </div>
    </div>
  );
}

export default Stepper;