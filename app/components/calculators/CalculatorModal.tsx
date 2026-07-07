"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./calculators.module.css";

export type CalculatorType = "mortgage" | "purchase";

type Props = {
  type: CalculatorType;
  onClose: () => void;
  defaultPrice?: number | string;
};

type Currency = "EUR" | "USD";
type PurchaseType = "new" | "resale" | "plot";

function parseAmount(value: unknown, fallback = 1000000): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  const raw = String(value ?? "")
    .replace(/[^\d.,]/g, "")
    .trim();

  if (!raw) return fallback;

  const dotCount = (raw.match(/\./g) || []).length;
  const commaCount = (raw.match(/,/g) || []).length;

  let normalized = raw;

  if (dotCount > 1 && commaCount === 0) {
    normalized = raw.replace(/\./g, "");
  } else if (commaCount > 0 && dotCount > 0) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else if (commaCount > 0 && dotCount === 0) {
    normalized = raw.replace(",", ".");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function formatMoney(value: number, currency: Currency) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

function clampNumber(value: number, min = 0) {
  if (!Number.isFinite(value)) return min;
  return Math.max(value, min);
}

const PURCHASE_DEFAULTS: Record<
  PurchaseType,
  {
    label: string;
    description: string;
    taxAName: string;
    taxARate: number;
    taxBName: string;
    taxBRate: number;
  }
> = {
  new: {
    label: "Nueva propiedad",
    description: "Impuestos si la propiedad es vendida por un promotor inmobiliario.",
    taxAName: "IVA",
    taxARate: 10,
    taxBName: "Impuesto de Actos Jurídicos Documentados",
    taxBRate: 1.2
  },
  resale: {
    label: "De segunda mano",
    description: "Impuestos habituales para una propiedad de segunda mano en Andalucía.",
    taxAName: "ITP",
    taxARate: 7,
    taxBName: "AJD",
    taxBRate: 0
  },
  plot: {
    label: "Parcela",
    description: "Estimación para parcela sujeta a IVA. Puede variar según el tipo de vendedor y operación.",
    taxAName: "IVA",
    taxARate: 21,
    taxBName: "Impuesto de Actos Jurídicos Documentados",
    taxBRate: 1.2
  }
};

export default function CalculatorModal({ type, onClose, defaultPrice }: Props) {
  const parsedDefaultPrice = useMemo(
    () => parseAmount(defaultPrice, 1000000),
    [defaultPrice]
  );

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
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose} type="button">
          Cerrar
        </button>

        {type === "mortgage" ? (
          <MortgageCalculator defaultPrice={parsedDefaultPrice} />
        ) : (
          <PurchaseCostCalculator defaultPrice={parsedDefaultPrice} />
        )}
      </div>
    </div>
  );
}

function MortgageCalculator({ defaultPrice }: { defaultPrice: number }) {
  const [currency, setCurrency] = useState<Currency>("EUR");
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
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : months > 0
        ? loanAmount / months
        : 0;

  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - loanAmount;

  return (
    <div>
      <span className={styles.eyebrow}>Calculadora financiera</span>
      <h2 className={styles.title}>Calculadora de hipoteca</h2>

      <p className={styles.description}>
        Esta calculadora permite estimar las cuotas mensuales aproximadas de una hipoteca
        en función del precio de la propiedad, el importe financiado, el tipo de interés
        anual y el plazo de amortización.
      </p>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Moneda</span>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
          >
            <option value="EUR">Euro — EUR</option>
            <option value="USD">Dólar — USD</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Precio de la propiedad</span>
          <input
            type="number"
            value={propertyPrice}
            onChange={(event) => setPropertyPrice(Number(event.target.value))}
          />
        </label>

        <label className={styles.field}>
          <span>¿Cuánto quieres pedir prestado?</span>
          <input
            type="number"
            value={Math.round(loanAmount)}
            onChange={(event) => setLoanAmount(Number(event.target.value))}
          />
          <small>
            Como referencia, algunos bancos pueden financiar entre el 50% y el 70%
            según perfil, residencia fiscal y condiciones de la operación.
          </small>
        </label>

        <label className={styles.field}>
          <span>Interés anual</span>
          <input
            type="number"
            step="0.1"
            value={annualInterest}
            onChange={(event) => setAnnualInterest(Number(event.target.value))}
          />
          <small>Valor orientativo editable. Se usa 3% como referencia inicial.</small>
        </label>

        <label className={styles.field}>
          <span>Plazo de amortización</span>
          <input
            type="number"
            value={years}
            onChange={(event) => setYears(Number(event.target.value))}
          />
          <small>La duración habitual puede situarse alrededor de 20 años.</small>
        </label>
      </div>

      <div className={styles.resultHero}>
        <span>Cuota mensual estimada</span>
        <strong>{formatMoney(monthlyPayment, currency)}</strong>
      </div>

      <div className={styles.resultGrid}>
        <ResultItem label="Importe financiado" value={formatMoney(loanAmount, currency)} />
        <ResultItem label="Depósito inicial" value={formatMoney(deposit, currency)} />
        <ResultItem label="Porcentaje financiado" value={`${financedPercent.toFixed(1)}%`} />
        <ResultItem label="Total estimado pagado" value={formatMoney(totalPaid, currency)} />
        <ResultItem label="Intereses estimados" value={formatMoney(totalInterest, currency)} />
      </div>

      <p className={styles.disclaimer}>
        Cálculo orientativo. Las condiciones definitivas dependen de la entidad financiera,
        perfil del comprador, residencia fiscal, tasación, documentación y condiciones
        particulares de la operación.
      </p>
    </div>
  );
}

function PurchaseCostCalculator({ defaultPrice }: { defaultPrice: number }) {
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [purchasePrice, setPurchasePrice] = useState(defaultPrice);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("new");

  const currentDefaults = PURCHASE_DEFAULTS[purchaseType];

  const [taxAName, setTaxAName] = useState(currentDefaults.taxAName);
  const [taxARate, setTaxARate] = useState(currentDefaults.taxARate);
  const [taxBName, setTaxBName] = useState(currentDefaults.taxBName);
  const [taxBRate, setTaxBRate] = useState(currentDefaults.taxBRate);

  const [lawyerRate, setLawyerRate] = useState(1);
  const [notaryRate, setNotaryRate] = useState(0.08);
  const [registryRate, setRegistryRate] = useState(0.04);
  const [bankRate, setBankRate] = useState(0.02);

  useEffect(() => {
    setPurchasePrice(defaultPrice);
  }, [defaultPrice]);

  useEffect(() => {
    const defaults = PURCHASE_DEFAULTS[purchaseType];
    setTaxAName(defaults.taxAName);
    setTaxARate(defaults.taxARate);
    setTaxBName(defaults.taxBName);
    setTaxBRate(defaults.taxBRate);
  }, [purchaseType]);

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
      <span className={styles.eyebrow}>Costes de compra</span>
      <h2 className={styles.title}>Calculadora de coste de compra</h2>

      <p className={styles.description}>
        Este formulario estima los costes e impuestos asociados a la compra de una
        propiedad. La principal diferencia es si la propiedad se compra directamente
        a un promotor, si es de segunda mano o si se trata de una parcela.
      </p>

      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Moneda</span>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
          >
            <option value="EUR">Euro — EUR</option>
            <option value="USD">Dólar — USD</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Precio de compra</span>
          <input
            type="number"
            value={purchasePrice}
            onChange={(event) => setPurchasePrice(Number(event.target.value))}
          />
        </label>

        <label className={styles.field}>
          <span>Tipo de compra</span>
          <select
            value={purchaseType}
            onChange={(event) => setPurchaseType(event.target.value as PurchaseType)}
          >
            <option value="new">Nueva propiedad</option>
            <option value="resale">De segunda mano</option>
            <option value="plot">Parcela</option>
          </select>
        </label>
      </div>

      <div className={styles.block}>
        <h3>Impuestos estimados</h3>
        <p>{currentDefaults.description}</p>

        <div className={styles.editableRows}>
          <EditableCostRow
            name={taxAName}
            setName={setTaxAName}
            rate={taxARate}
            setRate={setTaxARate}
            amount={taxAAmount}
            currency={currency}
          />

          <EditableCostRow
            name={taxBName}
            setName={setTaxBName}
            rate={taxBRate}
            setRate={setTaxBRate}
            amount={taxBAmount}
            currency={currency}
          />
        </div>

        <div className={styles.totalLine}>
          <span>Total de impuestos a pagar</span>
          <strong>{formatMoney(totalTaxes, currency)}</strong>
        </div>
      </div>

      <div className={styles.block}>
        <h3>Aproximación de otros gastos de compra</h3>
        <p>Valores orientativos editables según profesional, operación y documentación.</p>

        <div className={styles.editableRows}>
          <EditablePercentRow
            label="Gastos de abogado"
            rate={lawyerRate}
            setRate={setLawyerRate}
            amount={lawyerAmount}
            currency={currency}
          />

          <EditablePercentRow
            label="Gastos de notario"
            rate={notaryRate}
            setRate={setNotaryRate}
            amount={notaryAmount}
            currency={currency}
          />

          <EditablePercentRow
            label="Gastos de registro"
            rate={registryRate}
            setRate={setRegistryRate}
            amount={registryAmount}
            currency={currency}
          />

          <EditablePercentRow
            label="Coste del cheque / transferencia bancaria"
            rate={bankRate}
            setRate={setBankRate}
            amount={bankAmount}
            currency={currency}
          />
        </div>

        <div className={styles.totalLine}>
          <span>Total de otros gastos a pagar</span>
          <strong>{formatMoney(totalOtherCosts, currency)}</strong>
        </div>
      </div>

      <div className={styles.resultHero}>
        <span>Coste total estimado de compra</span>
        <strong>{formatMoney(totalPurchaseCost, currency)}</strong>
      </div>

      <p className={styles.mortgageNote}>
        Si está pensando en solicitar financiación, algunos bancos pueden conceder
        hipotecas a compradores no residentes en torno al 50% del precio de compra,
        equivalente en este caso a {formatMoney(mortgageReference, currency)}.
        Pueden existir excepciones según perfil, importe, documentación y entidad.
      </p>

      <p className={styles.disclaimer}>
        Estas cifras son aproximadas y se basan en situaciones comunes para compradores.
        Los impuestos y costes definitivos pueden variar según comunidad autónoma,
        tipo de activo, vendedor, estructura de la compraventa, financiación y criterio
        profesional. Larum puede acompañar el proceso junto con asesores fiscales,
        legales y financieros especializados.
      </p>
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
  name,
  setName,
  rate,
  setRate,
  amount,
  currency
}: {
  name: string;
  setName: (value: string) => void;
  rate: number;
  setRate: (value: number) => void;
  amount: number;
  currency: Currency;
}) {
  return (
    <div className={styles.costRow}>
      <input
        className={styles.costNameInput}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <div className={styles.rateInputWrap}>
        <input
          type="number"
          step="0.1"
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
        />
        <span>%</span>
      </div>

      <strong>{formatMoney(amount, currency)}</strong>
    </div>
  );
}

function EditablePercentRow({
  label,
  rate,
  setRate,
  amount,
  currency
}: {
  label: string;
  rate: number;
  setRate: (value: number) => void;
  amount: number;
  currency: Currency;
}) {
  return (
    <div className={styles.costRow}>
      <span>{label}</span>

      <div className={styles.rateInputWrap}>
        <input
          type="number"
          step="0.01"
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
        />
        <span>%</span>
      </div>

      <strong>{formatMoney(amount, currency)}</strong>
    </div>
  );
}