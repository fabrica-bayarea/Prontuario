function Etapa3({formData,handleChange,handleSubmit,anteriorEtapa}){

  return(
  <>
  <div>
    <fieldset>
      <label>
      Quais serviços você tem interesse? <span className="required">*</span>
      </label>

      {[
        'Direito', 
        'Nutrição',
        'Psicologia', 
        'Clínica Escola de Odontologia', 
        'Clínica Escola Saúde: Enfermagem, Farmácia e Biomedicina', 
        'Pedagogia Projeto Letrar Cidadania', 
        'Serviço Social', 
        'Análise de Desen. de Sistemas/Curso de Inclusão Digital',
        'NAF - Núcleo de Apoio Fiscal'
      ].map((opcao) => (
        <label key={opcao} style={{ display: "block" }}>
        
          <input
            type="checkbox"
            id="servicoIESB"
            name="servicoIESB"
            value={opcao}
            checked={formData.servicoIESB.includes(opcao)}
            onChange={handleChange}
          />
          {opcao}
            </label>
        ))}
    </fieldset>
  </div>

  <div>
    <fieldset>
      <label>
        Antes de chegar ao IESB você buscou atendimento em outro lugar?<span className="required">*</span>
      </label>
      {[
        'Não',
        'Conselho Tutelar ',
        'Delegacia',
        'CEAM ',
        'CRAS',
        'CAPS',
        'Hospital',
        'UBS',
        'NAF - Núcleo de Apoio Fiscal',
      ].map((opcao) => (
      <label key={opcao} style={{display:"block"}}>
        <input
          type="checkbox"
          id="antesIESB"
          name="antesIESB"
          value={opcao}
          checked={formData.antesIESB.includes(opcao)}
          onChange={handleChange}
        />
        {opcao}
        </label>
    ))}
    </fieldset>  
  </div>

  <div>
      <label htmlFor="encaminhamentoMedico">Você foi encaminhado por algum médico ou órgão do governo?<span className="required">*</span> </label>
      <input type="text" id='encaminhamentoMedico' name='encaminhamentoMedico' value={formData.encaminhamentoMedico} onChange={handleChange} />
  </div>


    {/*botões para voltar etapa e enviar formulario*/}
    <div>
      <button type='button' onClick={anteriorEtapa}>voltar</button>

      <button type='button' onClick={handleSubmit}>Enviar</button>
    </div>
  </>
    )
  }

export default Etapa3