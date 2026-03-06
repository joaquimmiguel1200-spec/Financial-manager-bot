import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-display font-bold text-primary-foreground">Política de Privacidade</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-6 text-sm text-foreground/80 leading-relaxed pb-10">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-display font-bold text-foreground">Política de Privacidade</h1>
          <p className="text-xs text-muted-foreground">Última atualização: 05 de março de 2026</p>
          <p className="text-xs text-muted-foreground">Em conformidade com a LGPD (Lei 13.709/2018)</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">1. Introdução</h2>
          <p>Esta Política de Privacidade descreve como o FinançasIA ("nós", "nosso" ou "Aplicativo") coleta, usa, armazena e protege suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e as diretrizes do Google Play.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">2. Dados Coletados</h2>
          <p>Coletamos os seguintes dados pessoais:</p>
          
          <h3 className="font-semibold text-foreground text-sm mt-3">2.1 Dados fornecidos pelo usuário:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Nome completo:</strong> para personalização da experiência</li>
            <li><strong>Endereço de e-mail:</strong> para autenticação e comunicação</li>
            <li><strong>Senha:</strong> armazenada com hash criptográfico SHA-256 (nunca em texto plano)</li>
            <li><strong>Dados financeiros:</strong> transações, categorias, valores, métodos de pagamento e metas</li>
          </ul>

          <h3 className="font-semibold text-foreground text-sm mt-3">2.2 Dados coletados automaticamente:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Data e hora de acesso:</strong> para registro de sessão</li>
            <li><strong>Dados de uso:</strong> interações com o Chat IA e funcionalidades utilizadas</li>
          </ul>

          <h3 className="font-semibold text-foreground text-sm mt-3">2.3 Dados NÃO coletados:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Localização geográfica (GPS)</li>
            <li>Contatos do dispositivo</li>
            <li>Fotos, vídeos ou arquivos de mídia</li>
            <li>Dados de outros aplicativos</li>
            <li>Identificadores de publicidade</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">3. Finalidade do Tratamento</h2>
          <p>Utilizamos seus dados para as seguintes finalidades (Art. 7º, LGPD):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Execução do contrato:</strong> Prover o serviço de gestão financeira</li>
            <li><strong>Consentimento:</strong> Envio de comunicações e notificações</li>
            <li><strong>Legítimo interesse:</strong> Melhorias no Aplicativo e análise de uso</li>
            <li><strong>Segurança:</strong> Prevenção de fraudes e proteção de dados</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">4. Base Legal (Art. 7º, LGPD)</h2>
          <p>O tratamento dos seus dados pessoais é fundamentado nas seguintes bases legais:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Consentimento (Art. 7º, I):</strong> ao criar sua conta e aceitar esta política</li>
            <li><strong>Execução de contrato (Art. 7º, V):</strong> para prestação dos serviços contratados</li>
            <li><strong>Legítimo interesse (Art. 7º, IX):</strong> para melhoria contínua do serviço</li>
            <li><strong>Exercício regular de direitos (Art. 7º, VI):</strong> para defesa em processos</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">5. Armazenamento e Segurança</h2>
          <p>Seus dados são protegidos por múltiplas camadas de segurança:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Criptografia SHA-256:</strong> senhas nunca são armazenadas em texto plano</li>
            <li><strong>Isolamento de dados:</strong> cada usuário acessa apenas seus próprios dados</li>
            <li><strong>Proteção contra XSS:</strong> sanitização de todos os inputs</li>
            <li><strong>Rate limiting:</strong> proteção contra ataques de força bruta</li>
            <li><strong>Armazenamento local:</strong> dados financeiros ficam armazenados no dispositivo do usuário (localStorage), sem transmissão para servidores externos</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">6. Compartilhamento de Dados</h2>
          <p><strong>NÃO compartilhamos seus dados pessoais com terceiros</strong>, exceto:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Quando exigido por lei ou ordem judicial</li>
            <li>Para proteção dos direitos, propriedade ou segurança do Aplicativo</li>
            <li>Com seu consentimento expresso</li>
          </ul>
          <p className="font-semibold">Não vendemos, alugamos ou comercializamos seus dados pessoais em nenhuma circunstância.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">7. Direitos do Titular (Art. 18, LGPD)</h2>
          <p>Conforme a LGPD, você tem direito a:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e acessá-los</li>
            <li><strong>Correção:</strong> solicitar correção de dados incompletos ou desatualizados</li>
            <li><strong>Anonimização ou bloqueio:</strong> de dados desnecessários ou excessivos</li>
            <li><strong>Eliminação:</strong> solicitar a exclusão de seus dados pessoais</li>
            <li><strong>Portabilidade:</strong> exportar seus dados (funcionalidade de exportação CSV/TXT)</li>
            <li><strong>Informação sobre compartilhamento:</strong> saber com quem seus dados são compartilhados</li>
            <li><strong>Revogação do consentimento:</strong> revogar o consentimento a qualquer momento</li>
            <li><strong>Oposição:</strong> opor-se ao tratamento baseado em legítimo interesse</li>
          </ul>
          <p>Para exercer seus direitos, utilize a funcionalidade de exclusão de conta no perfil ou entre em contato por e-mail.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">8. Retenção de Dados</h2>
          <p>Seus dados são retidos enquanto sua conta estiver ativa. Após a exclusão da conta:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Todos os dados pessoais são removidos imediatamente do dispositivo</li>
            <li>Dados de backup (se existirem) são removidos em até 30 dias</li>
            <li>Registros de transações financeiras são removidos permanentemente</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">9. Dados de Menores</h2>
          <p>O FinançasIA não é direcionado a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se identificarmos que um menor criou uma conta, excluiremos os dados imediatamente.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">10. Transferência Internacional</h2>
          <p>Seus dados financeiros são armazenados localmente no seu dispositivo e <strong>não são transferidos para servidores em outros países</strong>. Caso isso mude futuramente, garantiremos conformidade com o Art. 33 da LGPD.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">11. Cookies e Tecnologias de Rastreamento</h2>
          <p>O FinançasIA utiliza apenas <strong>armazenamento local (localStorage)</strong> para manter seus dados e sessão. Não utilizamos cookies de terceiros, pixels de rastreamento ou tecnologias de tracking.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">12. Alterações nesta Política</h2>
          <p>Podemos atualizar esta Política periodicamente. Alterações significativas serão comunicadas por notificação no Aplicativo. Recomendamos revisar esta página regularmente.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">13. Encarregado de Dados (DPO)</h2>
          <p>Em conformidade com o Art. 41 da LGPD, nosso Encarregado de Proteção de Dados pode ser contatado em:</p>
          <p><strong>E-mail:</strong> privacidade@financasia.app</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">14. Autoridade Nacional de Proteção de Dados</h2>
          <p>Se você acredita que seus direitos de proteção de dados foram violados, você pode registrar uma reclamação junto à Autoridade Nacional de Proteção de Dados (ANPD):</p>
          <p><strong>Site:</strong> <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.gov.br/anpd</a></p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">15. Contato</h2>
          <p>Para questões sobre privacidade e proteção de dados:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>E-mail geral:</strong> suporte@financasia.app</li>
            <li><strong>E-mail DPO:</strong> privacidade@financasia.app</li>
          </ul>
        </section>

        <div className="pt-4 border-t border-border text-center">
          <Button variant="outline" onClick={() => navigate('/terms')} className="text-xs">
            ← Ver Termos de Uso
          </Button>
        </div>
      </main>
    </div>
  );
}
