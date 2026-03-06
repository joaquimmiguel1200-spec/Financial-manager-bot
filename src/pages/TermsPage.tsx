import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-display font-bold text-primary-foreground">Termos de Uso</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-6 text-sm text-foreground/80 leading-relaxed pb-10">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-display font-bold text-foreground">Termos de Uso</h1>
          <p className="text-xs text-muted-foreground">Última atualização: 05 de março de 2026</p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">1. Aceitação dos Termos</h2>
          <p>Ao acessar, baixar ou utilizar o aplicativo FinançasIA ("Aplicativo"), você concorda com estes Termos de Uso. Caso não concorde com qualquer disposição, não utilize o Aplicativo.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">2. Descrição do Serviço</h2>
          <p>O FinançasIA é um aplicativo de gestão de finanças pessoais que permite:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Registro de transações financeiras (receitas e despesas)</li>
            <li>Registro por linguagem natural via Chat IA</li>
            <li>Acompanhamento de metas financeiras</li>
            <li>Exportação de relatórios (CSV e TXT)</li>
            <li>Visualização de dashboard com resumo financeiro</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">3. Cadastro e Conta</h2>
          <p>Para utilizar o Aplicativo, você deve criar uma conta fornecendo nome, e-mail e senha. Você é responsável por:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Fornecer informações verdadeiras e atualizadas</li>
            <li>Manter a confidencialidade de suas credenciais de acesso</li>
            <li>Todas as atividades realizadas com sua conta</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">4. Planos e Assinatura</h2>
          <p>O Aplicativo oferece os seguintes planos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Grátis:</strong> até 30 transações/mês, 5 interações com Chat IA/dia, 1 meta financeira</li>
            <li><strong>Pro Mensal (R$ 9,90/mês):</strong> uso ilimitado de todas as funcionalidades</li>
            <li><strong>Pro Anual (R$ 7,90/mês):</strong> uso ilimitado com desconto anual</li>
          </ul>
          <p>Planos Pro incluem 7 dias de teste gratuito. Após o período de teste, a cobrança será realizada automaticamente conforme o plano escolhido.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">5. Cancelamento e Reembolso</h2>
          <p>Você pode cancelar sua assinatura a qualquer momento nas configurações do perfil. O cancelamento:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Entra em vigor ao final do período já pago</li>
            <li>Reverte sua conta para o plano Grátis</li>
            <li>Não gera reembolso proporcional do período restante</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">6. Propriedade Intelectual</h2>
          <p>Todo o conteúdo, design, código-fonte, marcas e logotipos do FinançasIA são de propriedade exclusiva do desenvolvedor e estão protegidos pela legislação brasileira de propriedade intelectual (Lei 9.610/98 e Lei 9.279/96).</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">7. Uso Permitido</h2>
          <p>Você se compromete a:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utilizar o Aplicativo apenas para fins pessoais e lícitos</li>
            <li>Não tentar acessar dados de outros usuários</li>
            <li>Não realizar engenharia reversa ou descompilar o Aplicativo</li>
            <li>Não utilizar o Aplicativo para atividades fraudulentas</li>
            <li>Não transmitir conteúdo malicioso (vírus, malware, etc.)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">8. Limitação de Responsabilidade</h2>
          <p>O FinançasIA é uma ferramenta de organização financeira pessoal e <strong>não constitui aconselhamento financeiro, contábil ou fiscal</strong>. O desenvolvedor não se responsabiliza por:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Decisões financeiras tomadas com base nas informações do Aplicativo</li>
            <li>Perdas financeiras decorrentes do uso do Aplicativo</li>
            <li>Indisponibilidade temporária do serviço</li>
            <li>Perda de dados decorrente de falhas técnicas</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">9. Exclusão de Conta</h2>
          <p>Você pode solicitar a exclusão de sua conta a qualquer momento na seção "Zona de Perigo" do perfil. A exclusão é permanente e irreversível, incluindo todos os dados financeiros associados.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">10. Alterações nos Termos</h2>
          <p>Reservamo-nos o direito de alterar estes Termos a qualquer momento. Alterações significativas serão notificadas por meio do Aplicativo. O uso continuado após a notificação constitui aceitação dos novos termos.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">11. Legislação Aplicável</h2>
          <p>Estes Termos são regidos pela legislação brasileira, incluindo o Código de Defesa do Consumidor (Lei 8.078/90) e o Marco Civil da Internet (Lei 12.965/14). O foro competente é o da comarca de domicílio do usuário.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-semibold text-foreground text-base">12. Contato</h2>
          <p>Para dúvidas sobre estes Termos, entre em contato pelo e-mail: <strong>suporte@financasia.app</strong></p>
        </section>

        <div className="pt-4 border-t border-border text-center">
          <Button variant="outline" onClick={() => navigate('/privacy')} className="text-xs">
            Ver Política de Privacidade →
          </Button>
        </div>
      </main>
    </div>
  );
}
