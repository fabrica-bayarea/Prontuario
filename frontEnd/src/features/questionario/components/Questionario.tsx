import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionarioSchema, FormularioData } from '../schema';
import Etapa1 from './Etapa1';
import Etapa2 from './Etapa2';
import Etapa3 from './Etapa3';
import Etapa4 from './Etapa4';
import { useCriarProntuario } from '../api/api';
import Header from './Header';
import './Questionario.css';
import Stepper from './Stepper';

const camposPorEtapa: Record<number, any> = {
  1: [
      'nome','email','cpf','dataNascimento','idade','cep','estadoCivil','genero','corRaca','clinicaAtendimento','areaAtendimento','classAtendimento','estado','cidade','telefone','atendimentoParaQuem','acompanhamentoOutroLugar',
     ],
  2: [
      'dependentes'
     ],  
  3: [
      'pessoasPorCasa','suaCasaE','rendaFamiliar','origemRenda','suaCasaEstuda','residemSuaCasa','residenciaDoencaCronica','residenciaDeficiencia',
     ],
  4: [
      'servicoIESB', 'antesIESB', 'encaminhamentoMedico'
     ],
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
    setValue,
    control
  } = useForm<FormularioData>({
    resolver: zodResolver(questionarioSchema) as any,
    mode: 'onChange',
  });

  const atendimentoParaQuem = watch('atendimentoParaQuem');

  const proximaEtapa = async () => {
    const camposParaValidar = camposPorEtapa[etapaAtual] as (keyof FormularioData)[];
    const isEtapaValida = await trigger(camposParaValidar);

    if (isEtapaValida) {
      if (etapaAtual === 1 && atendimentoParaQuem === 'Você') {
        setEtapaAtual(3);
      } else {
        setEtapaAtual((prev) => prev + 1);
      }
    }
  };

  const anteriorEtapa = () => {
    if (etapaAtual === 3 && atendimentoParaQuem === 'Você') {
      setEtapaAtual(1);
    } else if (etapaAtual > 1) {
      setEtapaAtual((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: FormularioData) => {
    try {
      console.log('A enviar dados...', data);
      const resposta = await criarProntuario(data);
      console.log('✅ Resposta do Banco (JSON):\n', JSON.stringify(resposta, null, 2));
      alert(`Formulário salvo com sucesso! ID: ${resposta.id}`);
    } catch (error) {
      console.error('❌ Erro ao enviar:', error);
      alert('Houve um erro ao salvar os dados.');
    }
  };

  return (
    <div className="layout-geral">
      <div style={{ flex: 1 }}>
        <Header />
        <div className="conteudo-principal">
          <div className="stepper">
            <Stepper etapaAtual={etapaAtual} />
          </div>

          <div className="main-form">
            <form 
              onSubmit={handleSubmit(
                onSubmit, 
                (erros) => console.log('❌ O Zod bloqueou o envio! Campos com erro:', erros)
              )} 
              id="questionario-form"
            >
              {etapaAtual === 1 && (
                <Etapa1 
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  control={control}
                  proximaEtapa={proximaEtapa}
                />
              )}
              {etapaAtual === 2 && (
                <Etapa2
                  register={register}
                  errors={errors}
                  control={control}
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
                  control={control}
                  proximaEtapa={proximaEtapa}
                  anteriorEtapa={anteriorEtapa}
                />
              )}
              {etapaAtual === 4 && (
                <Etapa4
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  control={control}
                  anteriorEtapa={anteriorEtapa}
                  isPending={isPending}
                />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionario;
