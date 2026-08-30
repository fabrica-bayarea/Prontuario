import nodemailer from 'nodemailer';

const isDev = process.env.NODE_ENV !== 'production';

export async function enviarEmailRecuperacao(
  para: string,
  nome: string,
  token: string
): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${frontendUrl}/redefinir-senha?token=${token}`;

  if (isDev) {
    console.log('\n========== EMAIL DE RECUPERAÇÃO (DEV) ==========');
    console.log(`Para: ${para}`);
    console.log(`Nome: ${nome}`);
    console.log(`Link: ${link}`);
    console.log('================================================\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@iesb.edu.br',
    to: para,
    subject: 'Recuperação de Senha — Prontuário BayArea',
    html: `<p>Olá ${nome},</p>
           <p>Clique no link abaixo para redefinir sua senha:</p>
           <p><a href="${link}">${link}</a></p>
           <p>Este link é válido por 2 horas.</p>`,
  });
}

export async function enviarEmailBoasVindas(
  para: string,
  nome: string,
  senhaProvisoria: string,
  matricula: string
): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const loginUrl = `${frontendUrl}/login`;

  if (isDev) {
    console.log('\n========== EMAIL DE BOAS-VINDAS (DEV) ==========');
    console.log(`Para: ${para}`);
    console.log(`Nome: ${nome}`);
    console.log(`Matrícula/Login: ${matricula}`);
    console.log(`Senha Provisória: ${senhaProvisoria}`);
    console.log('================================================\n');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@iesb.edu.br',
    to: para,
    subject: 'Bem-vindo(a) ao Prontuário BayArea',
    html: `
      <h2>Olá, ${nome}!</h2>
      <p>Sua conta no Prontuário BayArea foi criada com sucesso.</p>
      <p>Você já pode acessar o sistema utilizando as seguintes credenciais provisórias:</p>
      <ul>
        <li><strong>Matrícula (Login):</strong> ${matricula}</li>
        <li><strong>Senha Provisória:</strong> ${senhaProvisoria}</li>
      </ul>
      <p><strong>Atenção:</strong> Por motivos de segurança, no seu primeiro acesso você será obrigado(a) a redefinir esta senha.</p>
      <p><a href="${loginUrl}" style="display:inline-block;padding:10px 20px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:4px;">Acessar o Sistema</a></p>
    `,
  });
}
