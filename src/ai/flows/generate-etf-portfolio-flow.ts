
'use server';
/**
 * @fileOverview A Genkit flow to generate ETF-based portfolio recommendations.
 *
 * - generateEtfPortfolio - A function that calls the Genkit flow.
 * - GenerateEtfPortfolioInput - The input type for the flow.
 * - GenerateEtfPortfolioOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEtfPortfolioInputSchema = z.object({
  name: z.string().optional().describe('Client\'s name.'),
  age: z.number().optional().describe('Client\'s age.'),
  investmentHorizon: z.string().optional().describe('Client\'s investment horizon (e.g., "Short-term (1-3 years)", "7+ years").'),
  riskTolerance: z.string().optional().describe('Client\'s risk tolerance (e.g., "Low", "Medium", "High").'),
  objective: z.string().optional().describe('Client\'s investment objectives, comma-separated (e.g., "Retirement Planning, Wealth Growth").'),
  annualIncome: z.string().optional().describe('Client\'s annual income (e.g., "$100,000 - $150,000").'),
  netWorth: z.string().optional().describe('Client\'s estimated net worth (e.g., "$500,000").'),
  liquidityNeeds: z.string().optional().describe('Client\'s liquidity needs (e.g., "Low", "Moderate").'),
  taxBracket: z.string().optional().describe('Client\'s estimated tax bracket as a percentage string (e.g., "24%").'),
  accountTypes: z.string().optional().describe('Types of accounts the client holds, comma-separated (e.g., "Taxable, Roth IRA, 401k").'),
  currentHoldings: z.string().optional().describe('Brief description of client\'s current holdings or "None".'),
  esgConsiderations: z.boolean().optional().describe('Whether the client has ESG considerations.'),
});
export type GenerateEtfPortfolioInput = z.infer<typeof GenerateEtfPortfolioInputSchema>;

const EtfAllocationSchema = z.object({
  etf: z.string().describe('The ETF ticker symbol.'),
  allocation: z.string().describe('The percentage allocation for this ETF (e.g., "25%").'),
  assetClass: z.string().describe('The asset class of the ETF (e.g., "U.S. Large Cap").'),
});

const GenerateEtfPortfolioOutputSchema = z.object({
  portfolioName: z.string().describe('The name of the recommended portfolio (e.g., "Recommended Portfolio for John Smith").'),
  allocations: z.array(EtfAllocationSchema).describe('An array of ETF allocations.'),
  rationaleSummary: z.string().describe('A brief rationale for major allocations, as a single string, with newlines separating individual rationales.'),
});
export type GenerateEtfPortfolioOutput = z.infer<typeof GenerateEtfPortfolioOutputSchema>;

export async function generateEtfPortfolio(input: GenerateEtfPortfolioInput): Promise<GenerateEtfPortfolioOutput> {
  return generateEtfPortfolioFlow(input);
}

const portfolioGenerationPrompt = ai.definePrompt({
  name: 'generateEtfPortfolioPrompt',
  input: {schema: GenerateEtfPortfolioInputSchema},
  output: {schema: GenerateEtfPortfolioOutputSchema},
  prompt: `You are a portfolio construction assistant.

Based on the following client profile, generate a personalized ETF-based portfolio recommendation. Your goal is to balance diversification, risk tolerance, and tax efficiency, with allocations adding up to 100%.

Client Profile:
{{#if name}}- Name: {{name}}{{/if}}
{{#if age}}- Age: {{age}}{{/if}}
{{#if investmentHorizon}}- Investment Horizon: {{investmentHorizon}}{{/if}}
{{#if riskTolerance}}- Risk Tolerance: {{riskTolerance}}{{/if}}
{{#if objective}}- Investment Objective: {{objective}}{{/if}}
{{#if annualIncome}}- Annual Income: {{annualIncome}}{{/if}}
{{#if netWorth}}- Net Worth: {{netWorth}}{{/if}}
{{#if liquidityNeeds}}- Liquidity Needs: {{liquidityNeeds}}{{/if}}
{{#if taxBracket}}- Tax Bracket: {{taxBracket}}%{{/if}}
{{#if accountTypes}}- Account Types: {{accountTypes}}{{/if}}
{{#if currentHoldings}}- Current Holdings: {{currentHoldings}}{{/if}}
{{#if esgConsiderations}}- ESG Considerations: Yes{{else}}- ESG Considerations: No{{/if}}

Instructions:
- Recommend 6-10 ETFs with % allocations.
- Ensure total allocation sums to 100%.
- Avoid overlap unless it fits the client's objective.
- Make tax-aware decisions based on account types if provided.
- Use plain, advisor-friendly language.
- Output should be a JSON object with the following structure:
  {
    "portfolioName": "Recommended Portfolio for {{#if name}}{{name}}{{else}}the Client{{/if}}",
    "allocations": [
      { "etf": "VOO", "percentage": "25%", "assetClass": "U.S. Large Cap" },
      // ... more allocations (ensure this array has 6-10 items and percentages sum to 100%)
    ],
    "rationaleSummary": "Brief rationale per major allocation (1-2 lines each), as a single string with newlines separating rationales."
  }
Please provide a complete and valid JSON object matching this structure.
Ensure ETF allocations sum to 100%.
`,
});

const generateEtfPortfolioFlow = ai.defineFlow(
  {
    name: 'generateEtfPortfolioFlow',
    inputSchema: GenerateEtfPortfolioInputSchema,
    outputSchema: GenerateEtfPortfolioOutputSchema,
  },
  async (input) => {
    const {output} = await portfolioGenerationPrompt(input);
    if (!output) {
      throw new Error("Could not generate portfolio recommendation at this time.");
    }
    // Ensure allocations sum to roughly 100% as a basic check.
    // More complex validation could be added here.
    let totalAllocation = 0;
    try {
        output.allocations.forEach(a => {
            totalAllocation += parseFloat(a.percentage.replace('%', ''));
        });
        if (Math.abs(totalAllocation - 100) > 5) { // Allow for minor LLM rounding issues (e.g. 99.9 or 100.1)
            console.warn(`AI returned allocations summing to ${totalAllocation}%, not 100%.`);
            // Optionally, you could throw an error or try to normalize, but for now, we'll log and proceed.
        }
    } catch (e) {
        console.error("Error parsing allocation percentages from AI output", e);
        // Potentially throw new Error("AI returned invalid allocation percentages.");
    }
    return output;
  }
);
