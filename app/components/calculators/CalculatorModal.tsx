"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./calculators.module.css";

export type CalculatorType = "mortgage" | "purchase";
export type CalcLang = "es" | "en";

type Props = {
  type: CalculatorType;
  onClose: () => void;
  defaultPrice?: number | string;
  lang?: CalcLang;
};

type Currency = "USD" | "EUR";
type PurchaseType = "resale" | "new" | "plot";

function parseAmount(value: unknown, fallback = 1000000): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const raw = String(value ?? "").replace(/[^\d.,]/g, "").trim();
  if (!raw) return fallback;
  const dotCount = (raw.match(/\./g) || []).length;
  const commaCount = (raw.match(/,/g) || []).length;
  let normalized = raw;
  if (dotCount > 1 && commaCount === 0) normalized = raw.replace(/\./g, "");
  else if (commaCount > 0 && dotCount > 0) normalized = raw.replace(/\./g, "").replace(",", ".");
  else if (commaCount > 0 && dotCount === 0) normalized = raw.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatMoney(value: number, currency: Currency, lang: CalcLang) {
  const locale = lang === "en" ? "en-US" : "es-ES";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function clampNumber(value: number, min = 0) {
  if (!Number.isFinite(value)) return min;
  return Math.max(value, min);
}

/* Marco fiscal NEUTRO — labels sin jurisdicción, tasas editables.
   Los valores por defecto usan la referencia fiscal española como
   punto de partida (declarado explícitamente al usuario). */
const PURCHASE_DEFAULTS: Record<
  PurchaseType,
  {
    labelEs: string; labelEn: string;
    descEs: string;  descEn: string;
    taxAName: { es: string; en: string };
    taxARate: number;
    taxBName: { es: string; en: string };
    taxBRate: number;
  }
> = {
  resale: {
    labelEs: "Inmueble usado",
    labelEn: "Existing property",
    descEs: "Estimación orientativa para la compra de un inmueble ya construido. Los tipos aplicables se ajustan según jurisdicción, tipo de vendedor y estructura de la operación.",
    descEn: "Indicative estimate for the purchase of an existing residence. Actual rates depend on jurisdiction, seller type and the structure of the transaction.",
    taxAName: { es: "Impuesto de transferencia", en: "Transfer tax" },
    taxARate: 7,
    taxBName: { es: "Timbrados y tasas registrales", en: "Stamp duty and registry fees" },
    taxBRate: 0,
  },
  new: {
    labelEs: "Obra nueva (venta por promotor)",
    labelEn: "New build (developer sale)",
    descEs: "Estimación orientativa cuando el vendedor es un promotor inmobiliario. Puede aplicarse IVA u otro impuesto indirecto según jurisdicción.",
    descEn: "Indicative estimate when the seller is a real-estate developer. Value-added tax or an equivalent indirect tax may apply depending on jurisdiction.",
    taxAName: { es: "Impuesto indirecto (IVA / VAT)", en: "Indirect tax (VAT)" },
    taxARate: 10,
    taxBName: { es: "Timbrados y tasas registrales", en: "Stamp duty and registry fees" },
    taxBRate: 1.2,
  },
  plot: {
    labelEs: "Parcela / terreno",
    labelEn: "Land / plot",
    descEs: "Estimación orientativa para la compra de un terreno. El tratamiento fiscal varía según jurisdicción, calificación urbanística y tipo de vendedor.",
    descEn: "Indicative estimate for the purchase of land. Tax treatment varies with jurisdiction, zoning classification and seller type.",
    taxAName: { es: "Impuesto de transferencia / IVA", en: "Transfer tax / VAT" },
    taxARate: 21,
    taxBName: { es: "Timbrados y tasas registrales", en: "Stamp duty and registry fees" },
    taxBRate: 1.2,
  },
};

/* Diccionario de strings */
const T = {
  close: { es: "Cerrar", en: "Close" },
  // MORTGAGE
  mtgEyebrow: { es: "Calculadora financiera", en: "Finance calculator" },
  mtgTitle: { es: "Calculadora de hipoteca", en: "Mortgage calculator" },
  mtgIntro: {
    es: "Estima la cuota mensual aproximada de una hipoteca en función del precio de la propiedad, el importe financiado, el tipo de interés anual y el plazo.",
    en: "Estimate the approximate monthly payment on a mortgage based on the property price, loan amount, annual interest rate and term.",
  },
  currency: { es: "Moneda", en: "Currency" },
  propertyPrice: { es: "Precio de la propiedad", en: "Property price" },
  loanAmount: { es: "¿Cuánto desea financiar?", en: "How much would you like to borrow?" },
  loanHelp: {
    es: "Como orientación, para compradores no residentes algunas entidades financian entre el 50% y el 70% del precio, sujeto a perfil y documentación.",
    en: "As a guide, for non-resident buyers some lenders finance between 50% and 70% of the price, subject to buyer profile and documentation.",
  },
  interest: { es: "Interés anual", en: "Annual interest rate" },
  interestHelp: { es: "Valor orientativo editable. 3% como referencia inicial.", en: "Editable reference value. 3% used as an initial reference." },
  term: { es: "Plazo de amortización (años)", en: "Amortisation term (years)" },
  termHelp: { es: "El plazo habitual suele situarse en torno a los 20 años.", en: "Typical terms tend to sit around 20 years." },
  monthly: { es: "Cuota mensual estimada", en: "Estimated monthly payment" },
  financed: { es: "Importe financiado", en: "Loan amount" },
  deposit: { es: "Aporte inicial", en: "Down payment" },
  financedPct: { es: "% financiado", en: "% financed" },
  totalPaid: { es: "Total estimado pagado", en: "Total estimated paid" },
  totalInterest: { es: "Intereses estimados", en: "Estimated interest" },
  mtgDisclaimer: {
    es: "Cálculo orientativo. Las condiciones definitivas dependen de la entidad financiera, del perfil del comprador, de la residencia fiscal, de la tasación y de la documentación aportada. Recomendamos validar con un asesor financiero local.",
    en: "Indicative calculation. Final terms depend on the lender, the buyer's profile, tax residency, valuation and supporting documentation. We recommend validation with a local financial adviser.",
  },
  // PURCHASE
  pEyebrow: { es: "Costes de compra", en: "Acquisition costs" },
  pTitle: { es: "Calculadora de costes de adquisición", en: "Acquisition cost calculator" },
  pIntro: {
    es: "Estima los impuestos y costes asociados a la compra. El resultado depende de la jurisdicción, el tipo de operación y la estructura elegida. Todos los tipos son editables.",
    en: "Estimate the taxes and costs associated with the acquisition. The result depends on jurisdiction, transaction type and the chosen structure. All rates are editable.",
  },
  purchasePrice: { es: "Precio de compra", en: "Purchase price" },
  purchaseType: { es: "Tipo de operación", en: "Transaction type" },
  taxesTitle: { es: "Impuestos estimados", en: "Estimated taxes" },
  taxesTotal: { es: "Total de impuestos", en: "Total taxes" },
  otherTitle: { es: "Otros gastos de adquisición", en: "Other acquisition costs" },
  otherIntro: { es: "Valores orientativos editables según profesional, operación y documentación.", en: "Editable reference values depending on the professionals involved, the transaction and documentation." },
  lawyer: { es: "Honorarios legales", en: "Legal fees" },
  notary: { es: "Honorarios de escribanía / notaría", en: "Notary fees" },
  registry: { es: "Registro de la propiedad", en: "Property registry" },
  bank: { es: "Cheque bancario / transferencia", en: "Bank draft / wire transfer" },
  otherTotal: { es: "Total otros gastos", en: "Total other costs" },
  grandTotal: { es: "Coste total estimado de compra", en: "Estimated total acquisition cost" },
  mtgNote: {
    es: "Si valora financiación, algunos bancos pueden conceder hipotecas a compradores no residentes en torno al 50% del precio, equivalente en este caso a {ref}. Pueden existir excepciones según perfil, importe y entidad.",
    en: "If financing is under consideration, some lenders offer mortgages to non-resident buyers of around 50% of the price, equivalent here to {ref}. Exceptions may apply depending on profile, amount and lender.",
  },
  pDisclaimer: {
    es: "Cifras aproximadas basadas en supuestos habituales. Los impuestos y costes definitivos varían según jurisdicción, tipo de activo, perfil del vendedor, estructura de la operación y criterio profesional. Larum acompaña la coordinación con asesores fiscales, legales y financieros independientes.",
    en: "Indicative figures based on common assumptions. Final taxes and costs vary with jurisdiction, asset type, seller profile, transaction structure and professional judgement. Larum coordinates the process alongside independent tax, legal and financial advisers.",
  },
  territoryNote: {
    es: "Los valores predeterminados corresponden a la referencia fiscal española (ITP/IVA/AJD y honorarios profesionales habituales). Todas las tasas son editables: ajústelas a la jurisdicción aplicable a su operación.",
    en: "Default values reflect the Spanish tax framework (ITP/VAT/stamp duty and standard professional fees). All rates are editable — adjust them to the jurisdiction applicable to your transaction.",
  },
};

export default function CalculatorModal({ type, onClose, defaultPrice, lang = "es" }: Props) {
  const parsedDefaultPrice = useMemo(() => parseAmount(defaultPrice, 1000000), [defaultPrice]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(event) => event.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} type="button">
          {T.close[lang]}
        </button>
        {type === "mortgage" ? (
          <MortgageCalculator defaultPrice={parsedDefaultPrice} lang={lang} />
        ) : (
          <PurchaseCostCalculator defaultPrice={parsedDefaultPrice} lang={lang} />
        )}
      </div>
    </div>
  );
}

function MortgageCalculator({ defaultPrice, lang }: { defaultPrice: number; lang: CalcLang }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [propertyPrice, setPropertyPrice] = useState(defaultPrice);
  const [loanAmount, setLoanAmount] = useState(defaultPrice * 0.7);
  const [annualInterest, setAnnualInterest] = useState(3);
  const [years, setYears] = useState(20);

  useEffect(() => {
    setPropertyPrice(defaultPrice);
    setLoanAmount(defaultPrice * 0.7);
  }, [defaultPrice]);

  const deposit = clampNumber(propertyPrice - loanAmount);
  const financedPercent = propertyPrice > 0 ? (loanAmount / propertyPrice) * 100 : 0;
  const months = years * 12;
  const monthlyRate = annualInterest / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : months > 0 ? loanAmount / months : 0;
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - loanAmount;

  return (
    <div>
      <span className={styles.eyebrow}>{T.mtgEyebrow[lang]}</span>
      <h2 className={styles.title}>{T.mtgTitle[lang]}</h2>
      <p className={styles.description}>{T.mtgIntro[lang]}</p>

      <div className={styles.territoryNote}>
        <span className={styles.territoryNoteLabel}>{lang === 'en' ? 'Reference' : 'Referencia'}</span>
        <p>{T.territoryNote[lang]}</p>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>{T.currency[lang]}</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            <option value="USD">USD — {lang === 'en' ? 'US Dollar' : 'Dólar'}</option>
            <option value="EUR">EUR — {lang === 'en' ? 'Euro' : 'Euro'}</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>{T.propertyPrice[lang]}</span>
          <input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} />
        </label>

        <label className={styles.field}>
          <span>{T.loanAmount[lang]}</span>
          <input type="number" value={Math.round(loanAmount)} onChange={(e) => setLoanAmount(Number(e.target.value))} />
          <small>{T.loanHelp[lang]}</small>
        </label>

        <label className={styles.field}>
          <span>{T.interest[lang]}</span>
          <input type="number" step="0.1" value={annualInterest} onChange={(e) => setAnnualInterest(Number(e.target.value))} />
          <small>{T.interestHelp[lang]}</small>
        </label>

        <label className={styles.field}>
          <span>{T.term[lang]}</span>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
          <small>{T.termHelp[lang]}</small>
        </label>
      </div>

      <div className={styles.resultHero}>
        <span>{T.monthly[lang]}</span>
        <strong>{formatMoney(monthlyPayment, currency, lang)}</strong>
      </div>

      <div className={styles.resultGrid}>
        <ResultItem label={T.financed[lang]} value={formatMoney(loanAmount, currency, lang)} />
        <ResultItem label={T.deposit[lang]} value={formatMoney(deposit, currency, lang)} />
        <ResultItem label={T.financedPct[lang]} value={`${financedPercent.toFixed(1)}%`} />
        <ResultItem label={T.totalPaid[lang]} value={formatMoney(totalPaid, currency, lang)} />
        <ResultItem label={T.totalInterest[lang]} value={formatMoney(totalInterest, currency, lang)} />
      </div>

      <p className={styles.disclaimer}>{T.mtgDisclaimer[lang]}</p>
    </div>
  );
}

function PurchaseCostCalculator({ defaultPrice, lang }: { defaultPrice: number; lang: CalcLang }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [purchasePrice, setPurchasePrice] = useState(defaultPrice);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("resale");

  const currentDefaults = PURCHASE_DEFAULTS[purchaseType];

  const [taxAName, setTaxAName] = useState(currentDefaults.taxAName[lang]);
  const [taxARate, setTaxARate] = useState(currentDefaults.taxARate);
  const [taxBName, setTaxBName] = useState(currentDefaults.taxBName[lang]);
  const [taxBRate, setTaxBRate] = useState(currentDefaults.taxBRate);

  const [lawyerRate, setLawyerRate] = useState(1);
  const [notaryRate, setNotaryRate] = useState(0.08);
  const [registryRate, setRegistryRate] = useState(0.04);
  const [bankRate, setBankRate] = useState(0.02);

  useEffect(() => {
    setPurchasePrice(defaultPrice);
  }, [defaultPrice]);

  useEffect(() => {
    const d = PURCHASE_DEFAULTS[purchaseType];
    setTaxAName(d.taxAName[lang]);
    setTaxARate(d.taxARate);
    setTaxBName(d.taxBName[lang]);
    setTaxBRate(d.taxBRate);
  }, [purchaseType, lang]);

  const taxAAmount = purchasePrice * (taxARate / 100);
  const taxBAmount = purchasePrice * (taxBRate / 100);
  const totalTaxes = taxAAmount + taxBAmount;

  const lawyerAmount = purchasePrice * (lawyerRate / 100);
  const notaryAmount = purchasePrice * (notaryRate / 100);
  const registryAmount = purchasePrice * (registryRate / 100);
  const bankAmount = purchasePrice * (bankRate / 100);
  const totalOtherCosts = lawyerAmount + notaryAmount + registryAmount + bankAmount;

  const totalPurchaseCost = purchasePrice + totalTaxes + totalOtherCosts;
  const mortgageReference = purchasePrice * 0.5;

  return (
    <div>
      <span className={styles.eyebrow}>{T.pEyebrow[lang]}</span>
      <h2 className={styles.title}>{T.pTitle[lang]}</h2>
      <p className={styles.description}>{T.pIntro[lang]}</p>

      <div className={styles.territoryNote}>
        <span className={styles.territoryNoteLabel}>{lang === 'en' ? 'Reference' : 'Referencia'}</span>
        <p>{T.territoryNote[lang]}</p>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>{T.currency[lang]}</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            <option value="USD">USD — {lang === 'en' ? 'US Dollar' : 'Dólar'}</option>
            <option value="EUR">EUR — {lang === 'en' ? 'Euro' : 'Euro'}</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>{T.purchasePrice[lang]}</span>
          <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} />
        </label>

        <label className={styles.field}>
          <span>{T.purchaseType[lang]}</span>
          <select value={purchaseType} onChange={(e) => setPurchaseType(e.target.value as PurchaseType)}>
            <option value="resale">{lang === 'en' ? PURCHASE_DEFAULTS.resale.labelEn : PURCHASE_DEFAULTS.resale.labelEs}</option>
            <option value="new">{lang === 'en' ? PURCHASE_DEFAULTS.new.labelEn : PURCHASE_DEFAULTS.new.labelEs}</option>
            <option value="plot">{lang === 'en' ? PURCHASE_DEFAULTS.plot.labelEn : PURCHASE_DEFAULTS.plot.labelEs}</option>
          </select>
        </label>
      </div>

      <div className={styles.block}>
        <h3>{T.taxesTitle[lang]}</h3>
        <p>{lang === 'en' ? currentDefaults.descEn : currentDefaults.descEs}</p>

        <div className={styles.editableRows}>
          <EditableCostRow name={taxAName} setName={setTaxAName} rate={taxARate} setRate={setTaxARate} amount={taxAAmount} currency={currency} lang={lang} />
          <EditableCostRow name={taxBName} setName={setTaxBName} rate={taxBRate} setRate={setTaxBRate} amount={taxBAmount} currency={currency} lang={lang} />
        </div>

        <div className={styles.totalLine}>
          <span>{T.taxesTotal[lang]}</span>
          <strong>{formatMoney(totalTaxes, currency, lang)}</strong>
        </div>
      </div>

      <div className={styles.block}>
        <h3>{T.otherTitle[lang]}</h3>
        <p>{T.otherIntro[lang]}</p>

        <div className={styles.editableRows}>
          <EditablePercentRow label={T.lawyer[lang]} rate={lawyerRate} setRate={setLawyerRate} amount={lawyerAmount} currency={currency} lang={lang} />
          <EditablePercentRow label={T.notary[lang]} rate={notaryRate} setRate={setNotaryRate} amount={notaryAmount} currency={currency} lang={lang} />
          <EditablePercentRow label={T.registry[lang]} rate={registryRate} setRate={setRegistryRate} amount={registryAmount} currency={currency} lang={lang} />
          <EditablePercentRow label={T.bank[lang]} rate={bankRate} setRate={setBankRate} amount={bankAmount} currency={currency} lang={lang} />
        </div>

        <div className={styles.totalLine}>
          <span>{T.otherTotal[lang]}</span>
          <strong>{formatMoney(totalOtherCosts, currency, lang)}</strong>
        </div>
      </div>

      <div className={styles.resultHero}>
        <span>{T.grandTotal[lang]}</span>
        <strong>{formatMoney(totalPurchaseCost, currency, lang)}</strong>
      </div>

      <p className={styles.mortgageNote}>
        {T.mtgNote[lang].replace('{ref}', formatMoney(mortgageReference, currency, lang))}
      </p>

      <p className={styles.disclaimer}>{T.pDisclaimer[lang]}</p>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.resultItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EditableCostRow({
  name, setName, rate, setRate, amount, currency, lang,
}: {
  name: string; setName: (v: string) => void;
  rate: number; setRate: (v: number) => void;
  amount: number; currency: Currency; lang: CalcLang;
}) {
  return (
    <div className={styles.costRow}>
      <input className={styles.costNameInput} value={name} onChange={(e) => setName(e.target.value)} />
      <div className={styles.rateInputWrap}>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>%</span>
      </div>
      <strong>{formatMoney(amount, currency, lang)}</strong>
    </div>
  );
}

function EditablePercentRow({
  label, rate, setRate, amount, currency, lang,
}: {
  label: string;
  rate: number; setRate: (v: number) => void;
  amount: number; currency: Currency; lang: CalcLang;
}) {
  return (
    <div className={styles.costRow}>
      <span>{label}</span>
      <div className={styles.rateInputWrap}>
        <input type="number" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>%</span>
      </div>
      <strong>{formatMoney(amount, currency, lang)}</strong>
    </div>
  );
}
