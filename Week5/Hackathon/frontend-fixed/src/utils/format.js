export const currency = (n) => { try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n)||0); } catch { return '$'+(Number(n)||0); } };
