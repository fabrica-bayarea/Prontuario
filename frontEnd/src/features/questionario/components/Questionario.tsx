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
      'nome','email','cpf','dataNascimento','idade','cep','estadoCivil','genero','corRaca','estado','cidade','telefone','atendimentoParaQuem',
      'complemento', 'logradouro', 'bairro', 'atendimentoParaOutraPessoa'
     ],
  2: [
      'dependentes'
     ],  
  3: [
      'pessoasPorCasa','suaCasaE','rendaFamiliar','origemRenda','beneficioSocial','suaCasaEstuda','residemSuaCasa','residenciaDoencaCronica','residenciaDeficiencia',
      'outroTipoCasa', 'valorAluguel', 'outroOrigemRenda', 'CADUnico', 'outroBeneficio', 'outroBeneficioValor', 'quaisBeneficios', 'valoresBeneficios', 'valorMensalidade', 'quaisDeficiencia', 'outraDeficienciaEspecifique', 'acompanhamentoMedico', 'outroAcompanhamento', 'tipoAcompanhamento', 'especialidadeMedica', 'outraEspecialidade', 'gastosSaude', 'valoresGastosSaude', 'gastosAlimentacao', 'valoresGastosAlimentacao', 'possuiFinanciamento', 'tiposFinanciamento', 'gastoAgua', 'gastoEnergia', 'gastoInternet', 'gastoCondominio'
     ],
  4: [
      'servicoIESB', 'antesIESB', 'encaminhamentoMedico', 'comoSoubeIESB', 'fonteRedeSocio', 'outroFonteRedeSocio',
      'classAtendimento','faculdadeParticular','bolsaFaculdade','acompanhamentoOutroLugar'
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

  const scrollParaPrimeiroErro = () => {
    setTimeout(() => {
      // 1. Procurar elemento com classe de erro no input
      let firstErrorEl = document.querySelector('.input-error');
      
      // 2. Se não encontrar, procurar a mensagem de erro
      if (!firstErrorEl) {
        firstErrorEl = document.querySelector('.error-message');
      }

      // 3. Centralizar a tela no campo com erro
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if ('focus' in firstErrorEl && typeof (firstErrorEl as HTMLElement).focus === 'function') {
          (firstErrorEl as HTMLElement).focus();
        }
      }
    }, 100);
  };

  const proximaEtapa = async () => {
    const camposParaValidar = camposPorEtapa[etapaAtual] as (keyof FormularioData)[];
    const isEtapaValida = await trigger(camposParaValidar);

    if (isEtapaValida) {
      if (etapaAtual === 1 && atendimentoParaQuem === 'Você') {
        setEtapaAtual(3);
      } else {
        setEtapaAtual((prev) => prev + 1);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollParaPrimeiroErro();
    }
  };

  const anteriorEtapa = () => {
    if (etapaAtual === 3 && atendimentoParaQuem === 'Você') {
      setEtapaAtual(1);
    } else if (etapaAtual > 1) {
      setEtapaAtual((prev) => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: FormularioData) => {
    try {
      console.log('A enviar dados...', data);
      const resposta = await criarProntuario(data);
      console.log('✅ Resposta do Banco (JSON):\n', JSON.stringify(resposta, null, 2));
      alert(`Formulário salvo com sucesso! ID: ${resposta.id}`);
    } catch (error: any) {
      console.error('❌ Erro ao enviar:', error);
      const dataError = error.response?.data?.error;
      const msg = typeof dataError === 'string' ? dataError : (dataError?.message || error.message || 'Erro desconhecido');
      alert(`Houve um erro ao enviar para o servidor:\n\n${msg}`);
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
                (erros) => {
                  console.log('❌ O Zod bloqueou o envio! Campos com erro:', erros);
                  scrollParaPrimeiroErro();
                  const camposComErro = Object.keys(erros).map(key => `- ${key}`).join('\n');
                  alert(`O formulário não pôde ser enviado pois contém erros ou campos obrigatórios vazios.\n\nCampos pendentes:\n${camposComErro}\n\nPor favor, volte nas etapas anteriores e preencha-os.`);
                }
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
