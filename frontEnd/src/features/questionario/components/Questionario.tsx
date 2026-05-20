import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionarioSchema, FormularioData } from '../schema';
import Etapa1 from './Etapa1';
import Etapa2 from './Etapa2';
import Etapa3 from './Etapa3';
import { useCriarProntuario } from '../api/api'; 
import './Questionario.css';
import Stepper from './Stepper';

const camposPorEtapa: Record<number, any> = {
  1: ['nome', 'email', 'cpf', 'dataNascimento', 'idade', 'cep', 'estadoCivil', 'genero', 'corRaca', 'clinicaAtendimento', 'areaAtendimento', 'classAtendimento', 'estado', 'cidade', 'telefone', 'atendimentoParaQuem', 'acompanhamentoOutroLugar'],
  2: ['pessoasPorCasa', 'suaCasaE', 'rendaFamiliar', 'origemRenda', 'suaCasaEstuda', 'residemSuaCasa', 'residenciaDoencaCronica', 'residenciaDeficiencia'],
  3: ['servicoIESB', 'antesIESB', 'encaminhamentoMedico']
};

function Questionario() {
  const [etapaAtual, setEtapaAtual] = useState<number>(1);

  const { mutateAsync: criarProntuario, isPending } = useCriarProntuario();

  const { 
    register, 
    handleSubmit, 
    trigger, 
    formState: { errors }, 
    watch, 
    setValue 
  } = useForm<FormularioData>({
    resolver: zodResolver(questionarioSchema),
    mode: "onChange"
  });

  const proximaEtapa = async () => {
    const camposParaValidar = camposPorEtapa[etapaAtual];
    const isEtapaValida = await trigger(camposParaValidar);

    if (isEtapaValida) {
      setEtapaAtual((prev: number) => prev + 1);
    }
  };

  const anteriorEtapa = () => {
    if (etapaAtual > 1) {
      setEtapaAtual((prev: number) => prev - 1);
    }
  };

  const onSubmit = async (data: FormularioData) => {
    try {
      console.log("A enviar dados...", data);
      const resposta = await criarProntuario(data);
      console.log("✅ Sucesso!", resposta);
      alert(`Formulário salvo com sucesso! ID: ${resposta._id}`);
    } catch (error) {
      console.error("❌ Erro ao enviar:", error);
      alert("Houve um erro ao salvar os dados.");
    }
  };

  return (
    <div className="layout-geral">
      <div className="formulario-container conteudo-principal">
        <div className="formulario-header">
          <h1>Prontuário BayArea</h1>
          <p>Formulário de Prontuário</p>
        </div>

        <Stepper etapaAtual={etapaAtual} />

        <form onSubmit={handleSubmit(onSubmit)} id="questionario-form">
          {etapaAtual === 1 && (
            <Etapa1 
              register={register} 
              errors={errors} 
              watch={watch} 
              setValue={setValue} 
              proximaEtapa={proximaEtapa} 
            />
          )}
          {etapaAtual === 2 && (
            <Etapa2 
              register={register} 
              errors={errors} 
              watch={watch} 
              setValue={setValue} 
              proximaEtapa={proximaEtapa} 
              anteriorEtapa={anteriorEtapa} 
            />
          )}
          {etapaAtual === 3 && (
            <Etapa3 
              register={register} 
              errors={errors} 
              watch={watch} 
              setValue={setValue} 
              anteriorEtapa={anteriorEtapa} 
              isPending={isPending}
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default Questionario;