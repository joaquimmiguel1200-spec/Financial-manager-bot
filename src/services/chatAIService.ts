import type { Transaction, PaymentMethod, TransactionType } from '@/types';
import { securityService } from './securityService';

interface ParsedTransaction {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  installments?: number;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Alimentação': ['almoço', 'jantar', 'café', 'lanche', 'mercado', 'supermercado', 'restaurante', 'comida', 'pizza', 'hamburguer', 'açougue', 'padaria', 'feira'],
  'Transporte': ['uber', 'gasolina', 'combustível', 'ônibus', 'metrô', 'táxi', 'estacionamento', 'pedágio', 'carro', 'moto'],
  'Moradia': ['aluguel', 'condomínio', 'água', 'luz', 'energia', 'internet', 'gás', 'iptu'],
  'Saúde': ['farmácia', 'remédio', 'médico', 'hospital', 'dentista', 'plano de saúde', 'consulta', 'exame'],
  'Educação': ['curso', 'faculdade', 'escola', 'livro', 'material', 'mensalidade'],
  'Lazer': ['cinema', 'show', 'festa', 'bar', 'viagem', 'hotel', 'parque', 'teatro', 'jogo'],
  'Roupas': ['roupa', 'tênis', 'sapato', 'calça', 'camisa', 'vestido', 'blusa', 'jaqueta'],
  'Compras': ['comprei', 'compra', 'presente', 'loja', 'shopping'],
  'Tecnologia': ['celular', 'notebook', 'computador', 'fone', 'tablet', 'mouse', 'teclado', 'monitor', 'tv', 'televisão'],
  'Assinaturas': ['netflix', 'spotify', 'youtube', 'amazon', 'disney', 'hbo', 'streaming', 'assinatura'],
};

export const chatAIService = {
  parseMessage(message: string): ParsedTransaction | null {
    const lower = message.toLowerCase().trim();

    // Extract amount
    let amount = 0;
    const amountPatterns = [
      /r\$\s*([\d.,]+)/i,
      /([\d.,]+)\s*reais/i,
      /(\d+)\s*mil\s*reais/i,
      /(\d+)\s*mil/i,
    ];

    for (const pattern of amountPatterns) {
      const match = lower.match(pattern);
      if (match) {
        let val = match[1];
        if (pattern.source.includes('mil')) {
          amount = parseFloat(val) * 1000;
        } else {
          val = val.replace(/\./g, '').replace(',', '.');
          amount = parseFloat(val);
        }
        break;
      }
    }

    if (!amount || amount <= 0) return null;

    // Detect payment method
    let paymentMethod: PaymentMethod = 'dinheiro';
    if (/pix\s*parcela/i.test(lower)) paymentMethod = 'pix_parcelado';
    else if (/pix/i.test(lower)) paymentMethod = 'pix';
    else if (/cr[ée]dito|cart[ãa]o/i.test(lower)) paymentMethod = 'credito';
    else if (/d[ée]bito/i.test(lower)) paymentMethod = 'debito';
    else if (/boleto/i.test(lower)) paymentMethod = 'boleto';

    // Detect installments
    let installments: number | undefined;
    const installmentPatterns = [
      /(\d+)\s*[xX×]/,
      /em\s*(\d+)\s*(?:vez|parcela|x)/i,
      /parcelad[oa]\s*(?:em\s*)?(\d+)/i,
    ];
    for (const pattern of installmentPatterns) {
      const match = lower.match(pattern);
      if (match) { installments = parseInt(match[1]); break; }
    }

    // Detect category
    let category = 'Outros';
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(kw => lower.includes(kw))) { category = cat; break; }
    }

    // Clean description
    let description = message
      .replace(/r\$\s*[\d.,]+/gi, '')
      .replace(/[\d.,]+\s*reais/gi, '')
      .replace(/\d+\s*mil\s*reais/gi, '')
      .replace(/no\s*(pix|cr[ée]dito|d[ée]bito|cart[ãa]o|boleto|dinheiro)/gi, '')
      .replace(/em\s*\d+\s*(vez|parcela|x)\w*/gi, '')
      .replace(/parcelad[oa]\s*(em\s*)?\d*/gi, '')
      .replace(/\d+\s*[xX×]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!description) description = category;

    // Detect type
    const isIncome = /receb[ie]|sal[áa]rio|ganhe[i]|entrada|dep[oó]sito/i.test(lower);

    return {
      type: isIncome ? 'income' : 'expense',
      amount,
      category,
      description,
      paymentMethod,
      installments: installments && installments > 1 ? installments : undefined,
    };
  },

  createTransactions(parsed: ParsedTransaction, userId: string): Transaction[] {
    const now = new Date();
    const transactions: Transaction[] = [];

    if (parsed.installments) {
      const parentId = securityService.generateId();
      const installmentValue = Math.round((parsed.amount / parsed.installments) * 100) / 100;

      for (let i = 0; i < parsed.installments; i++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() + i);

        transactions.push({
          id: i === 0 ? parentId : securityService.generateId(),
          userId,
          type: parsed.type,
          amount: installmentValue,
          category: parsed.category,
          description: parsed.description,
          date: date.toISOString(),
          paymentMethod: parsed.paymentMethod,
          parentId: i > 0 ? parentId : undefined,
          totalAmount: parsed.amount,
          installments: [{
            number: i + 1,
            total: parsed.installments,
            value: installmentValue,
            dueDate: date.toISOString(),
            paid: i === 0,
          }],
          source: 'chat',
          createdAt: now.toISOString(),
        });
      }
    } else {
      transactions.push({
        id: securityService.generateId(),
        userId,
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        date: now.toISOString(),
        paymentMethod: parsed.paymentMethod,
        source: 'chat',
        createdAt: now.toISOString(),
      });
    }

    return transactions;
  },

  generateResponse(parsed: ParsedTransaction | null, message: string): string {
    if (!parsed) {
      if (/oi|ol[áa]|hey|opa/i.test(message)) {
        return '👋 Olá! Sou a IA do FinançasIA 2.0!\n\nMe diga seus gastos e eu registro automaticamente. Exemplo:\n\n💬 "Comprei um tênis de R$ 400 no cartão em 4x"\n💬 "Paguei R$ 85 de pix no mercado"\n💬 "Recebi R$ 5000 de salário"';
      }
      if (/ajuda|help|como/i.test(message)) {
        return '🤖 **Como usar o Chat IA:**\n\n• Diga o que comprou/recebeu com o valor\n• Posso detectar: Pix, Crédito, Débito, Boleto, Dinheiro\n• Parcelas automáticas: "em 5x", "parcelado em 10"\n• Categorias automáticas por palavras-chave\n\n**Exemplos:**\n"Gastei R$ 50 no almoço"\n"Comprei notebook de R$ 4000 no cartão em 10x"';
      }
      return '🤔 Não entendi. Me diga algo como:\n"Gastei R$ 50 no mercado" ou "Recebi R$ 3000 de salário"';
    }

    const { type, amount, category, paymentMethod, installments, description } = parsed;
    const formattedAmount = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (installments) {
      const installmentValue = (amount / installments).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return `✅ Gasto registrado!\n\n📝 ${description}\n💰 Total: ${formattedAmount}\n💳 ${paymentMethod === 'credito' ? 'Crédito' : 'Pix Parc.'}: ${installments}x de ${installmentValue}\n🏷️ ${category}\n📅 Parcelas adicionadas nas próximas faturas`;
    }

    const icon = type === 'income' ? '💰' : '💸';
    const methodLabel = paymentMethod === 'pix' ? '💚 Pix' : paymentMethod === 'credito' ? '💳 Crédito' : paymentMethod === 'debito' ? '💳 Débito' : '💵';

    return `✅ Registrado!\n\n${icon} ${description}\n${methodLabel} • ${formattedAmount} • ${category}`;
  },
};
