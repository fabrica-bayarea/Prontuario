import React from "react"; // Assegure-se de importar React

function Etapa3({formData,handleChange,handleSubmit,anteriorEtapa}){
  return(
  <form className="form-grid">
    <div className="col-12">
      <fieldset>
        <legend>Quais serviços você tem interesse? <span className="required">*</span></legend>
        <div className="checkbox-group">
        {[
          'Direito', 'Nutrição', 'Psicologia', 'Clínica Escola de Odontologia', 'Clínica Escola Saúde: Enfermagem, Farmácia e Biomedicina', 'Pedagogia Projeto Letrar Cidadania', 'Serviço Social', 'Análise de Desen. de Sistemas/Curso de Inclusão Digital', 'NAF - Núcleo de Apoio Fiscal'
        ].map((opcao) => (
          <label key={opcao} className="checkbox-option">
            <input type="checkbox" name="servicoIESB" value={opcao} checked={formData.servicoIESB.includes(opcao)} onChange={handleChange}/>
            {opcao}
          </label>
        ))}
        </div>
      </fieldset>
    </div>

    <div className="col-12">
      <fieldset>
        <legend>Antes de chegar ao IESB você buscou atendimento em outro lugar?<span className="required">*</span></legend>
        <div className="checkbox-group" style={{display:'grid', gridTemplateColumns:'1fr 1fr'}}>
        {[
          'Não', 'Conselho Tutelar ', 'Delegacia', 'CEAM ', 'CRAS', 'CAPS', 'Hospital', 'UBS', 'NAF - Núcleo de Apoio Fiscal',
        ].map((opcao) => (
        <label key={opcao} className="checkbox-option">
          <input type="checkbox" name="antesIESB" value={opcao} checked={formData.antesIESB.includes(opcao)} onChange={handleChange}/>
          {opcao}
          </label>
        ))}
        </div>
      </fieldset>  
    </div>

<div className="input-group col-12">
    <label>Você foi encaminhado por algum médico ou órgão do governo? <span className="required">*</span></label>
    
    <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', marginTop: '5px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input 
                type="radio" 
                id="encaminhadoSim" 
                name="temEncaminhamento" 
                value="sim" 
                checked={formData.temEncaminhamento === "sim"} 
                onChange={handleChange} 
            />
            <label htmlFor="encaminhadoSim" style={{ margin: 0, cursor: 'pointer' }}>Sim</label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input 
                type="radio" 
                id="encaminhadoNao" 
                name="temEncaminhamento" 
                value="nao" 
                checked={formData.temEncaminhamento === "nao"} 
                onChange={(e) => {
                    handleChange(e);
                    handleChange({ target: { name: 'encaminhamentoMedico', value: '' } }); 
                }} 
            />
            <label htmlFor="encaminhadoNao" style={{ margin: 0, cursor: 'pointer' }}>Não</label>
        </div>
    </div>

    {formData.temEncaminhamento === "sim" && (
        <input 
            type="text" 
            id='encaminhamentoMedico' 
            name='encaminhamentoMedico' 
            placeholder="Informe o médico ou órgão"
            value={formData.encaminhamentoMedico || ''} 
            onChange={handleChange} 
        />
    )}
</div>

    <div className="col-12 button-group">
      <button type='button' onClick={anteriorEtapa}>Voltar</button>
      <button type='button' onClick={handleSubmit}>Enviar</button>
    </div>
  </form>
  )
}
export default Etapa3